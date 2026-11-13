# JavaSkillX Architecture Specification

## 1. System Overview

JavaSkillX is an interactive full-stack assessment platform designed to evaluate Java developers across 50 rigorously curated questions in three fixed stages (Beginner, Intermediate, Advanced) and determine their Data Structures & Algorithms (DSA) readiness.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        JavaSkillX Web Client                           │
│  React 19 + Tailwind CSS + Lucide Icons                                │
├────────────────────────────────────────────────────────────────────────┤
│  Views:                                                                │
│  ├── Landing & Welcome Hero                                            │
│  ├── Candidate Dashboard (Real-time progress, DSA Gauge, Badges)       │
│  ├── Assessment Console (Sequential Unlocking, Code Editor, Runner)    │
│  ├── Completed Review Gallery (Post-submission library)                │
│  ├── Final Diagnostic Report (DSA Readiness, Weakness Breakdown)       │
│  └── Mock Technical Interview Room (6 Topical Tracks + Rubrics)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ JSON REST API
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 Full-Stack Node.js / Express Server                    │
├────────────────────────────────────────────────────────────────────────┤
│  Controllers & Middleware:                                             │
│  ├── /api/auth          (Guest init, User register/login, Sessions)    │
│  ├── /api/assessments   (Sequential engine, Submissions, Scoring)      │
│  ├── /api/code          (OpenJDK 17 compilation & sandboxed execution) │
│  ├── /api/interviews    (Mock interview prompts & rubric evaluation)   │
│  └── /api/achievements  (Milestone triggers & user badges)             │
├────────────────────────────────────────────────────────────────────────┤
│  Core Services:                                                        │
│  ├── JavaRunnerService  (Temporary workspace, javac, java, timeouts)   │
│  ├── StorageService     (Deterministic 2-mark rubrics, persistence)    │
│  └── DiagnosticService  (Weakness identification, DSA classification)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                        ┌───────────┴───────────┐
                        ▼                       ▼
            ┌───────────────────────┐ ┌────────────────────────┐
            │   Persistent Storage  │ │   OpenJDK 17 Sandbox   │
            │ JSON / PostgreSQL DB  │ │ javac & java Processes │
            └───────────────────────┘ └────────────────────────┘
```

## 2. Key Architecture Pillars

### A. Strict Sequential Progression & Anti-Leak Integrity
- Questions are strictly unlocked one-by-one: $Q_N$ must be submitted before $Q_{N+1}$ is revealed.
- The server sanitizes every question served by `/api/assessments/:id/current-question`. `expectedAnswer`, `expectedOutput`, `explanation`, and `hiddenTestCases` are never transmitted to the browser until the submission is finalized.
- Idempotent scoring rejects repeated submissions for the same question.

### B. Dual-Mode Authentication & Persistent Progress
- **Guest Mode**: Generates a persistent UUID token stored in browser `localStorage` and synchronized with the backend. Resuming works across page refreshes and browser restarts.
- **Registered User Mode**: Provides persistent account management with scrypt password hashing and cross-device sync.

### C. Sandboxed Code Execution
- Uses local OpenJDK 17 (`javac` and `java`) with a 4-second execution timeout, `-Xmx64m` memory limit, and isolated temporary workspaces.
- In Docker environments, code runs in the dedicated `runner` container with `--network none`.
