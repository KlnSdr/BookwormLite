FROM gcr.io/distroless/java21

WORKDIR /app

COPY out/artifacts/BookwormLite_jar/BookwormLite.jar /app/app.jar

EXPOSE 2711

CMD ["app.jar"]