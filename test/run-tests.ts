import { JavaRunnerService } from '../src/server/javaRunner.ts';
import { StorageService } from '../src/server/storage.ts';
import { QUESTIONS_DATABASE, getSanitizedQuestion } from '../src/server/questionsData.ts';

async function runAllTests() {
  console.log('==============================================');
  console.log('🚀 Running JavaSkillX Automated Verification Suite');
  console.log('==============================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  // TEST 1: Database Initialization & 50 Questions Count
  console.log('--- 1. Question Database & Stage Distribution ---');
  assert(QUESTIONS_DATABASE.length === 50, 'Exactly 50 assessment questions exist');

  const beginnerQuestions = QUESTIONS_DATABASE.filter((q) => q.stage === 'BEGINNER');
  const intermediateQuestions = QUESTIONS_DATABASE.filter((q) => q.stage === 'INTERMEDIATE');
  const advancedQuestions = QUESTIONS_DATABASE.filter((q) => q.stage === 'ADVANCED');

  assert(beginnerQuestions.length === 15, 'Stage 1 (Beginner) contains exactly 15 questions');
  assert(intermediateQuestions.length === 20, 'Stage 2 (Intermediate) contains exactly 20 questions');
  assert(advancedQuestions.length === 15, 'Stage 3 (Advanced) contains exactly 15 questions');

  // Verify unique IDs and non-empty explanations
  const ids = new Set(QUESTIONS_DATABASE.map((q) => q.id));
  assert(ids.size === 50, 'All 50 questions have unique IDs (1 to 50)');

  const validExplanations = QUESTIONS_DATABASE.every((q) => q.explanation && q.takeaway && q.commonMistakes);
  assert(validExplanations, 'All 50 questions have comprehensive explanations and takeaways');

  // TEST 2: Anti-Leak Sanitization
  console.log('\n--- 2. Question Anti-Leak Sanitization ---');
  const sampleCodingQ = QUESTIONS_DATABASE.find((q) => q.category === 'CODING')!;
  const sanitized = getSanitizedQuestion(sampleCodingQ);

  assert(sanitized.expectedAnswer === undefined, 'Sanitized question strips expectedAnswer');
  assert(sanitized.expectedOutput === undefined, 'Sanitized question strips expectedOutput');
  assert(sanitized.explanation === undefined, 'Sanitized question strips explanation');
  assert(sanitized.testCases === undefined, 'Sanitized question strips internal testCases');
  if (sanitized.sampleTestCases) {
    assert(sanitized.sampleTestCases.length > 0, 'Sanitized question preserves only visible sample test cases');
  }

  // TEST 3: OpenJDK 17 Compilation & Execution
  console.log('\n--- 3. JavaRunner Sandboxed Execution ---');
  const validJavaCode = `
  public class Solution {
      public static void main(String[] args) {
          System.out.println("Hello JavaSkillX");
      }
  }
  `;
  const run1 = await JavaRunnerService.runCode(validJavaCode);
  assert(run1.success && run1.output.trim() === 'Hello JavaSkillX', 'OpenJDK 17 successfully compiles and executes valid Java code');

  // Test standard input piping
  const stdinJavaCode = `
  import java.util.Scanner;
  public class Solution {
      public static void main(String[] args) {
          Scanner sc = new Scanner(System.in);
          int a = sc.nextInt();
          int b = sc.nextInt();
          System.out.println(a + b);
      }
  }
  `;
  const runStdin = await JavaRunnerService.runCode(stdinJavaCode, '15 25\n');
  assert(runStdin.success && runStdin.output.trim() === '40', 'OpenJDK 17 successfully pipes standard input to Java process');

  // Test compilation error handling
  const brokenJavaCode = `
  public class Solution {
      public static void main(String[] args) {
          int x = "String incompatible";
      }
  }
  `;
  const runBroken = await JavaRunnerService.runCode(brokenJavaCode);
  assert(!runBroken.success && runBroken.stage === 'COMPILATION', 'JavaRunner cleanly traps syntax/compilation errors');

  // Test timeout protection (infinite loop)
  const infiniteLoopCode = `
  public class Solution {
      public static void main(String[] args) {
          while (true) {}
      }
  }
  `;
  console.log('Testing timeout guard (expected ~4s)...');
  const runTimeout = await JavaRunnerService.runCode(infiniteLoopCode);
  assert(!runTimeout.success && Boolean(runTimeout.error?.includes('Time Limit Exceeded')), 'JavaRunner enforces 4-second timeout on infinite loops');

  // TEST 4: Assessment Progression & Sequential Enforcement
  console.log('\n--- 4. Assessment Engine & Progression Integrity ---');
  StorageService.initialize();
  const testGuestToken = 'test_guest_' + Date.now();
  const assessment = StorageService.startOrGetAssessment(undefined, testGuestToken);

  assert(assessment.currentQuestionIndex === 1, 'New assessment starts at Question 1');
  assert(assessment.status === 'IN_PROGRESS', 'New assessment status is IN_PROGRESS');

  // Attempt to skip to Question 5 (should be rejected)
  let skipCaught = false;
  try {
    await StorageService.submitAnswer(assessment.id, 5, 'Premature Answer');
  } catch (err: any) {
    skipCaught = err.message.includes('Sequential progression violation');
  }
  assert(skipCaught, 'Backend strictly rejects out-of-order question skipping');

  // Submit correct answer to Question 1: "8 bits, range -128 to 127"
  const q1Result = await StorageService.submitAnswer(assessment.id, 1, '8 bits, range -128 to 127');
  assert(Boolean(q1Result.answerRecord.isCorrect), 'Question 1 submitted and marked correct');
  assert(q1Result.answerRecord.marksAwarded === 2, 'Awarded exactly 2 marks for Question 1');
  assert(q1Result.assessment.currentQuestionIndex === 2, 'Assessment advances to Question 2 after submission');

  // Attempt duplicate submission on Question 1 (should be rejected)
  let duplicateCaught = false;
  try {
    await StorageService.submitAnswer(assessment.id, 1, '8 bits, range -128 to 127');
  } catch (err: any) {
    duplicateCaught = err.message.includes('already been answered');
  }
  assert(duplicateCaught, 'Backend prevents duplicate submissions and double scoring');

  // TEST 5: DSA Readiness & Weakness Calculation
  console.log('\n--- 5. DSA Readiness & Diagnostics ---');
  const dsaReport = StorageService.calculateDsaReadiness(assessment);
  assert(typeof dsaReport.score === 'number', 'DSA Readiness calculates numeric score');
  assert(Boolean(dsaReport.classification), 'DSA Readiness provides classification tier');
  assert(Boolean(dsaReport.badgeTitle), 'DSA Readiness provides descriptive badge title');

  // TEST 6: Authentication & Password Hashing
  console.log('\n--- 6. User Authentication & Password Hashing ---');
  const testUser = 'user_' + Date.now();
  const registered = StorageService.registerUser(testUser, `${testUser}@example.com`, 'SecurePass123!');
  assert(Boolean(registered.id), 'User registration creates persistent ID');
  assert(registered.passwordHash !== 'SecurePass123!', 'Plaintext password is never stored (scrypt hashed)');

  const authed = StorageService.authenticateUser(testUser, 'SecurePass123!');
  assert(authed !== null && authed.id === registered.id, 'User login succeeds with correct credentials');

  const failedAuth = StorageService.authenticateUser(testUser, 'WrongPassword');
  assert(failedAuth === null, 'User login rejected with wrong password');

  // Summary
  console.log('\n==============================================');
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('==============================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
