import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { TestCase } from './types.ts';

export interface RunResult {
  success: boolean;
  stage: 'COMPILATION' | 'RUNTIME' | 'COMPLETED';
  error?: string;
  output: string;
  executionTimeMs?: number;
}

export interface TestCaseEvaluationResult {
  testCaseId: string;
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  isHidden: boolean;
  executionTimeMs: number;
  error?: string;
}

export interface FullExecutionReport {
  compiled: boolean;
  compilationError?: string;
  allPassed: boolean;
  passedTestsCount: number;
  totalTestsCount: number;
  results: TestCaseEvaluationResult[];
  marksAwarded: number; // 0 to 2
}

/**
 * Sandboxed Java Execution Engine using local OpenJDK 17.
 * Strictly limits execution time, memory, stdout size, and enforces ephemeral file cleanup.
 */
export class JavaRunnerService {
  private static readonly MAX_EXECUTION_TIME_MS = 4000;
  private static readonly MAX_COMPILATION_TIME_MS = 5000;
  private static readonly MAX_OUTPUT_BYTES = 32 * 1024; // 32KB

  /**
   * Run standalone Java code with optional custom standard input
   */
  public static async runCode(code: string, customInput = ''): Promise<RunResult> {
    const runId = crypto.randomUUID();
    const tempDir = path.join('/tmp', `javaskillx_run_${runId}`);

    try {
      fs.mkdirSync(tempDir, { recursive: true });

      const className = this.extractClassName(code) || 'Solution';
      const javaFilePath = path.join(tempDir, `${className}.java`);

      // Basic static security inspection
      const securityIssue = this.inspectCodeSafety(code);
      if (securityIssue) {
        return {
          success: false,
          stage: 'COMPILATION',
          error: `Security Restriction: ${securityIssue}`,
          output: '',
        };
      }

      fs.writeFileSync(javaFilePath, code, 'utf-8');

      // 1. Compile
      const compileResult = await this.compileJava(tempDir, `${className}.java`);
      if (!compileResult.success) {
        return {
          success: false,
          stage: 'COMPILATION',
          error: compileResult.error,
          output: '',
        };
      }

      // 2. Execute
      const execResult = await this.executeJava(tempDir, className, customInput);
      return {
        success: execResult.exitCode === 0,
        stage: execResult.exitCode === 0 ? 'COMPLETED' : 'RUNTIME',
        error: execResult.exitCode === 0 ? undefined : execResult.stderr,
        output: execResult.stdout,
        executionTimeMs: execResult.durationMs,
      };
    } catch (err: any) {
      return {
        success: false,
        stage: 'RUNTIME',
        error: err.message || 'Execution failed unexpectedly.',
        output: '',
      };
    } finally {
      this.cleanupDir(tempDir);
    }
  }

  /**
   * Evaluates code against a suite of visible and hidden test cases
   */
  public static async evaluateTestCases(
    code: string,
    testCases: TestCase[],
    totalMarks = 2
  ): Promise<FullExecutionReport> {
    const runId = crypto.randomUUID();
    const tempDir = path.join('/tmp', `javaskillx_eval_${runId}`);

    try {
      fs.mkdirSync(tempDir, { recursive: true });

      const className = this.extractClassName(code) || 'Solution';
      const javaFilePath = path.join(tempDir, `${className}.java`);

      const securityIssue = this.inspectCodeSafety(code);
      if (securityIssue) {
        return {
          compiled: false,
          compilationError: `Security Restriction: ${securityIssue}`,
          allPassed: false,
          passedTestsCount: 0,
          totalTestsCount: testCases.length,
          results: [],
          marksAwarded: 0,
        };
      }

      fs.writeFileSync(javaFilePath, code, 'utf-8');

      // 1. Compile
      const compileResult = await this.compileJava(tempDir, `${className}.java`);
      if (!compileResult.success) {
        return {
          compiled: false,
          compilationError: compileResult.error,
          allPassed: false,
          passedTestsCount: 0,
          totalTestsCount: testCases.length,
          results: [],
          marksAwarded: 0,
        };
      }

      // 2. Run each test case
      const results: TestCaseEvaluationResult[] = [];
      let passedCount = 0;

      for (const tc of testCases) {
        const exec = await this.executeJava(tempDir, className, tc.input);
        const actualTrimmed = exec.stdout.trim().replace(/\r\n/g, '\n');
        const expectedTrimmed = tc.expectedOutput.trim().replace(/\r\n/g, '\n');
        const passed = exec.exitCode === 0 && actualTrimmed === expectedTrimmed;

        if (passed) passedCount++;

        results.push({
          testCaseId: tc.id,
          passed,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: exec.exitCode === 0 ? actualTrimmed : (exec.stderr || 'Runtime Error'),
          isHidden: tc.isHidden,
          executionTimeMs: exec.durationMs,
          error: exec.exitCode !== 0 ? exec.stderr : undefined,
        });
      }

      const allPassed = passedCount === testCases.length;
      let marksAwarded = 0;
      if (allPassed) {
        marksAwarded = totalMarks;
      } else if (passedCount > 0 && totalMarks >= 2) {
        // Partial credit: at least half marks if >= 50% test cases pass
        const ratio = passedCount / testCases.length;
        marksAwarded = ratio >= 0.5 ? 1 : 0;
      }

      return {
        compiled: true,
        allPassed,
        passedTestsCount: passedCount,
        totalTestsCount: testCases.length,
        results,
        marksAwarded,
      };
    } catch (err: any) {
      return {
        compiled: false,
        compilationError: err.message || 'System error during evaluation',
        allPassed: false,
        passedTestsCount: 0,
        totalTestsCount: testCases.length,
        results: [],
        marksAwarded: 0,
      };
    } finally {
      this.cleanupDir(tempDir);
    }
  }

  private static extractClassName(code: string): string | null {
    const match = code.match(/public\s+class\s+([A-Za-z0-9_]+)/) ||
                  code.match(/class\s+([A-Za-z0-9_]+)/);
    return match ? match[1] : null;
  }

  private static inspectCodeSafety(code: string): string | null {
    if (code.includes('java.lang.reflect') && (code.includes('setAccessible') || code.includes('Method'))) {
      return 'Reflection-based privilege escalation is restricted.';
    }
    if (code.includes('ProcessBuilder') || code.includes('Runtime.getRuntime().exec')) {
      return 'Direct OS process execution is forbidden.';
    }
    if (code.includes('System.exit(')) {
      return 'System.exit is restricted in test environment.';
    }
    return null;
  }

  private static compileJava(dir: string, fileName: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      const child = spawn('javac', ['-encoding', 'UTF-8', '-J-Xmx64m', fileName], {
        cwd: dir,
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let stderr = '';
      const timer = setTimeout(() => {
        child.kill('SIGKILL');
        resolve({ success: false, error: 'Compilation timed out (limit: 5s).' });
      }, this.MAX_COMPILATION_TIME_MS);

      child.stderr.on('data', (chunk) => {
        if (stderr.length < this.MAX_OUTPUT_BYTES) {
          stderr += chunk.toString();
        }
      });

      child.on('close', (code) => {
        clearTimeout(timer);
        if (code === 0) {
          resolve({ success: true });
        } else {
          // Clean up paths in error message
          const sanitizedError = stderr.replace(new RegExp(dir, 'g'), '');
          resolve({ success: false, error: sanitizedError.trim() });
        }
      });

      child.on('error', (err) => {
        clearTimeout(timer);
        resolve({ success: false, error: `Failed to invoke javac: ${err.message}` });
      });
    });
  }

  private static executeJava(
    dir: string,
    className: string,
    input: string
  ): Promise<{ exitCode: number | null; stdout: string; stderr: string; durationMs: number }> {
    return new Promise((resolve) => {
      const startTime = process.hrtime.bigint();
      const child = spawn(
        'java',
        [
          '-Xmx64m',
          '-Xms16m',
          '-XX:+UseSerialGC',
          '-Dfile.encoding=UTF-8',
          className,
        ],
        {
          cwd: dir,
          stdio: ['pipe', 'pipe', 'pipe'],
        }
      );

      let stdout = '';
      let stderr = '';
      let timedOut = false;

      const timer = setTimeout(() => {
        timedOut = true;
        child.kill('SIGKILL');
      }, this.MAX_EXECUTION_TIME_MS);

      if (input) {
        child.stdin.write(input);
      }
      child.stdin.end();

      child.stdout.on('data', (chunk) => {
        if (stdout.length < this.MAX_OUTPUT_BYTES) {
          stdout += chunk.toString();
        }
      });

      child.stderr.on('data', (chunk) => {
        if (stderr.length < this.MAX_OUTPUT_BYTES) {
          stderr += chunk.toString();
        }
      });

      child.on('close', (code) => {
        clearTimeout(timer);
        const endTime = process.hrtime.bigint();
        const durationMs = Number((endTime - startTime) / BigInt(1_000_000));

        if (timedOut) {
          resolve({
            exitCode: -1,
            stdout: stdout.trim(),
            stderr: `Time Limit Exceeded: Process terminated after ${this.MAX_EXECUTION_TIME_MS}ms. Check for infinite loops.`,
            durationMs: this.MAX_EXECUTION_TIME_MS,
          });
        } else {
          resolve({
            exitCode: code,
            stdout,
            stderr: stderr.trim(),
            durationMs,
          });
        }
      });

      child.on('error', (err) => {
        clearTimeout(timer);
        const endTime = process.hrtime.bigint();
        const durationMs = Number((endTime - startTime) / BigInt(1_000_000));
        resolve({
          exitCode: -1,
          stdout: '',
          stderr: `Execution error: ${err.message}`,
          durationMs,
        });
      });
    });
  }

  private static cleanupDir(dir: string): void {
    try {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    } catch {
      // Ignore cleanup errors
    }
  }
}
