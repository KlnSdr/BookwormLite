FROM docker.klnsdr.com/nyx-cli:1.3 as builder

WORKDIR /app

COPY . .

RUN nyx build

FROM gcr.io/distroless/java21

WORKDIR /app

COPY --from=builder /app/build/bookworm-3.3.jar /app/app.jar

EXPOSE 2711

CMD ["app.jar"]