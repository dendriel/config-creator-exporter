# config-creator-exporter
Configuration Exporter service from Config Creator solution


# Running locally

```shell
node server.js
```


# Run with Docker

Build
```shell
docker build -t dendriel/config-creator-exporter
```

Run
```shell
docker run --network host --name exporter -e NODE_ENV=<node-env> -e AUTH_KEY=<auth-key-value> dendriel/config-creator-exporter
```

- node-env: environment to run
- auth-key-value: authentication key for exporter service. Exporter service must have a service user, and a key for this user should me generated.
