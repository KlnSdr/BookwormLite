FROM docker.klnsdr.com/nyx-cli:1.1 as builder

WORKDIR /app

COPY . .

RUN nyx build

FROM gcr.io/distroless/java21

WORKDIR /app

COPY /app/build/bookworm/bookworm-3.1.jar /app/app.jar

EXPOSE 2711

CMD ["app.jar"]