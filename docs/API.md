# JavaSkillX REST API Specification

### Authentication
- `POST /api/auth/guest-init`: Initializes or verifies a guest session token.
- `POST /api/auth/register`: Registers a new user with scrypt password hashing.
- `POST /api/auth/login`: Authenticates user credentials.
- `GET /api/auth/me`: Returns active session profile.

### Assessment Progression
- `POST /api/assessments/start`: Starts or retrieves the active assessment for the current user or guest.
- `GET /api/assessments/:id`: Returns high-level assessment progress and score.
- `GET /api/assessments/:id/current-question`: Returns the sanitized current question without leaking answers or hidden test cases.
- `POST /api/assessments/:id/submit`: Evaluates answer/code against deterministic rubrics and test cases, awards marks (0-2), and returns full explanations.
- `GET /api/assessments/:id/completed-questions`: Returns the review gallery of all submitted questions.
- `POST /api/assessments/:id/restart`: Resets assessment back to Question 1.
- `GET /api/assessments/:id/report`: Generates the final performance report and DSA readiness scorecard.

### Code Runner Sandbox
- `POST /api/code/run`: Runs Java code in the isolated OpenJDK 17 sandbox with standard input support without officially submitting.

### Achievements
- `GET /api/achievements`: Returns all 8 achievements and their unlock status.

### Mock Technical Interview
- `GET /api/interviews/tracks`: Returns list of the 6 interview tracks.
- `POST /api/interviews/start`: Initializes an interview session.
- `GET /api/interviews/:sessionId/current`: Returns the current prompt and rubric criteria.
- `POST /api/interviews/:sessionId/submit`: Evaluates response against rubric and returns model explanation.
