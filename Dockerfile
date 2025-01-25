FROM openjdk:21-jdk-slim

WORKDIR /app

COPY out/artifacts/BookwormLite_jar/BookwormLite.jar /app/app.jar

EXPOSE 2711

CMD ["java", "-jar", "/app/app.jar"]