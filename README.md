# micro.js

## Introduction

> micro.js is a serverless & microservice framework using docker for Function as a Service(FaaS), aiming at helping developers and businesses to build serverless applications more faster and easily.

## Features

> Make serverless reachable 

![arch](https://github.com/Authing/micro.js/blob/master/assets/Architecture.png?raw=true)

1. Deploying micro services with docker containers
2. Transferring the data between the services via JSON strings and RESTful API
3. Every single serivice has it's own database
4. API Gateway serve as the controlling unit, which controls the whole system.You can do some universal works like auth or log
5. Monitoring services and automaticlly restarting the crushed services
6. Visual admin panel to manage and monitor services
7. Easily Integrated with Express.js or Koa.js
8. DevOps supported

## Installation

```
$ npm install micro.js
```

## Getting started

### Register service

``` javascript

var myMicroService = new Micro();

var exampleService = myMicroService.registerService({
    name: 'example',
    function: () => {
        console.log('service example');
    }
});

```
This will run the service in a docker named ```'micro_example'```.

### Register database

``` javascript

var exampleDB = exampleService.registerDatabase({
  name: 'example-db',
  type: 'mongodb',
  connection: {
    username: '',
    password: ''
  }
});

```
this will run the database service in a docker named ```'micro_example_db_example-db'```.

### Manage micro service

#### Start a service

``` javascript

exampleService.start();

```

#### Stop a service

``` javascript

exampleService.stop();

```

#### Restart a service

``` javascript

exampleService.reStart();

```

database service has the same methods.
