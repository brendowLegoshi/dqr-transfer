# DQR Transfer
## Description

This microservice make bank transfer and settlement

## Installation

Create a network to accommodate DQR apis

```bash
$ docker network create valtan
```

Install all dependencies

```bash
$ npm install
```

Than you can run the api

```bash
$ docker-compose up
```

Everything all right just go to http://localhost:3001/swagger

## Test

```bash
# unit tests
$ npm t
```
