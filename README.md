# config-creator-exporter
Configuration Exporter service from Config Creator solution


# Running locally

Setup
```shell
npm start
```

Start
```shell
npm start
```


# Run with Docker

Build
```shell
docker build -t dendriel/config-creator-exporter .
```

Run
```shell
docker run -d --name exporter -e QUEUE_URL=http://192.168.15.9:9324/queue/export-request -e SERVICE_URL=http://192.168.15.9 -e SERVICE_AUTH_KEY=<auth-key> dendriel/config-creator-exporter
```

- QUEUE_URL: where SQS queue instance is listening. For instance `http://192.168.15.9:9324/queue/export-request`;
- SERVICE_URL: where there is a proxy to backend applications. Running locally, config-creator-front nginx server have rules for this purpose;
- SERVICE_AUTH_KEY: authentication key for exporter service. Exporter service must have a service user, and a key for this user should be generated.

Run local SQS container:
```shell
docker run -d -p 9325:9325 -p 9324:9324 --name sqs-service roribio16/alpine-sqs:latest
```
