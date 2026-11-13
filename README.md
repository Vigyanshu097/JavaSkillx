# JavaSkillX — Java Programming Skill Assessment Platform

JavaSkillX is a production-quality, web-based assessment platform designed to rigorously evaluate a developer's Java programming competency across 50 sequential challenges and benchmark their readiness to start learning Data Structures & Algorithms (DSA).

---

## Key Features

- **50 Structured Sequential Questions**: Divided into 3 fixed tiers:
  - **Stage 1: Beginner (15 Questions · 30 Marks)**: Variables, data types, operator precedence, switch expressions, loops, arrays, String immutability, pass-by-value, type casting, basic I/O, anagrams.
  - **Stage 2: Intermediate (20 Questions · 40 Marks)**: Classes, constructors, inheritance, dynamic method dispatch, encapsulation, interfaces, method overloading, exception hierarchies, try-with-resources, Collections (ArrayList, HashMap, HashSet), recursion, Two Sum.
  - **Stage 3: Advanced (15 Questions · 30 Marks)**: Generics & PECS, Comparable/Comparator, Lambda expressions, Streams API pipelines, multithreading, synchronization, volatile & Java Memory Model, JVM memory, interval merging, sliding window.
- **Embedded OpenJDK 17 Sandbox**: Real `javac` compilation and `java` execution with strict timeouts (4s), memory restrictions (`-Xmx64m`), and isolated ephemeral workspaces.
- **Anti-Leak Integrity**: Server sanitizes upcoming questions. Expected answers, hidden test cases, and model explanations are stripped from client payloads until an answer is officially evaluated.
- **Quantitative DSA Readiness Scorecard**: Multi-factor algorithm evaluating coding challenge completion, Collections/OOP mastery, and core logic to generate an honest readiness classification.
- **Review Gallery**: Complete post-submission review library for previously answered questions with full model explanations and key takeaways.
- **Mock Technical Interview Suite**: 6 dedicated interview tracks (Fundamentals, OOP, Collections, Exceptions, Coding, Mixed) with instant rubric-based evaluation.
- **Dual Authentication**: Instant Guest Mode with browser persistence or Registered User accounts with secure scrypt password hashing.
- **Achievements & Badges**: 8 milestones unlocked dynamically based on assessment progression.

---

## Tech Stack

- **Frontend**: React 19, Tailwind CSS v4, Lucide Icons, Plus Jakarta Sans & JetBrains Mono typography.
- **Backend**: Node.js, Express, OpenJDK 17 headless runtime.
- **Data & Sandboxing**: Persistent JSON/PostgreSQL schema, child process sandboxing with memory and timeout enforcement.
- **Deployment**: Docker multi-stage build, Docker Compose with network-isolated runner.

---

## Verification & Tests

To execute the automated backend, sandboxing, and progression test suite:
```bash
npm test
```

To build for production:
```bash
npm run build
```
