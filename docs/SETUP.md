# JavaSkillX Setup and Deployment Guide

## Prerequisites

- Node.js 18+ or 20+
- OpenJDK 17 or newer (`javac` and `java` available in PATH)
- Docker & Docker Compose (optional for containerized deployment)

---

## Local Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Verify OpenJDK 17**:
   ```bash
   javac -version
   java -version
   ```

3. **Run Automated Test Suite**:
   ```bash
   npm test
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## Production Docker Deployment

1. **Build and Run with Docker Compose**:
   ```bash
   docker compose up --build -d
   ```

2. **Verify Services**:
   ```bash
   docker compose ps
   ```

3. **Stop Services**:
   ```bash
   docker compose down
   ```
