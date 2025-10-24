go o# Use an official OpenJDK runtime as a parent image
# Make sure the Java version (e.g., 21) matches your project's requirement
FROM eclipse-temurin:21-jdk-jammy

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper files first (for caching)
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download dependencies (this layer is cached if pom.xml doesn't change)
RUN ./mvnw dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the application using the Maven wrapper, skipping tests
RUN ./mvnw package -DskipTests

# Expose the port the app runs on (Spring Boot default is 8080)
EXPOSE 8080

# Command to run the executable JAR when the container starts
# Make sure the JAR filename matches your target folder
ENTRYPOINT ["java", "-jar", "target/TestiFlow-0.0.1-SNAPSHOT.jar"]