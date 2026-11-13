# JavaSkillX Isolated Execution Runner
# Base image containing lightweight OpenJDK 17 runtime
FROM openjdk:17-slim

# Create dedicated non-root runner user with limited privileges
RUN groupadd -r javarunner && useradd -r -g javarunner -m -d /home/javarunner javarunner

# Set working directory inside sandbox
WORKDIR /sandbox

# Restrict permissions
RUN chown -R javarunner:javarunner /sandbox && chmod 700 /sandbox

# Switch to unprivileged user
USER javarunner

# Default entrypoint for compiling and executing submitted code
ENTRYPOINT ["/bin/sh", "-c"]
CMD ["echo 'JavaRunner Ready'"]
