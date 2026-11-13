# JavaSkillX Database Architecture

## 1. Schema Overview

JavaSkillX utilizes a normalized schema supporting persistent users, guest sessions, sequential assessments, answer records, and achievements.

### Entities

1. **User**
   - `id`: UUID (Primary Key)
   - `username`: VARCHAR(50) UNIQUE NOT NULL
   - `email`: VARCHAR(100) UNIQUE NOT NULL
   - `passwordHash`: VARCHAR(128) NOT NULL (scrypt)
   - `salt`: VARCHAR(32) NOT NULL
   - `createdAt`: TIMESTAMP

2. **Assessment**
   - `id`: UUID (Primary Key)
   - `userId`: UUID (Nullable, Foreign Key -> User.id)
   - `guestToken`: VARCHAR(64) (Nullable)
   - `status`: VARCHAR(20) ('IN_PROGRESS' | 'COMPLETED')
   - `currentQuestionIndex`: INTEGER (1 to 50)
   - `totalScore`: INTEGER (0 to 100)
   - `stageScores`: JSON (Beginner / Intermediate / Advanced marks)
   - `topicScores`: JSON (Topic accuracy mapping)
   - `dsaReadiness`: JSON (Benchmark score, classification, breakdown)
   - `startedAt`: TIMESTAMP
   - `lastActivityAt`: TIMESTAMP
   - `completedAt`: TIMESTAMP

3. **UserAnswerRecord**
   - `questionId`: INTEGER (1 to 50)
   - `submittedAnswer`: TEXT
   - `isCorrect`: BOOLEAN
   - `marksAwarded`: INTEGER (0, 1, or 2)
   - `feedback`: TEXT
   - `testResults`: JSON (Passed/Failed test cases)
   - `submittedAt`: TIMESTAMP

4. **Achievement**
   - `id`: VARCHAR(50) (Primary Key)
   - `title`: VARCHAR(100)
   - `description`: TEXT
   - `category`: VARCHAR(50)
   - `icon`: VARCHAR(50)

5. **InterviewSession**
   - `id`: UUID (Primary Key)
   - `track`: VARCHAR(50)
   - `userId` / `guestToken`: VARCHAR(64)
   - `currentQuestionIndex`: INTEGER
   - `responses`: JSON
   - `status`: VARCHAR(20)
   - `startedAt`: TIMESTAMP
   - `completedAt`: TIMESTAMP
