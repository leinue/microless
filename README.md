![arch](https://github.com/Authing/micro.js/blob/master/assets/logo.png?raw=true)

Microservice framework for node.js to make container-based microservice web applications and APIs more enjoyable to write. Micro is based on koa.js, allowing you to use all the features that koa has.

## Features

> Make microservice reachable 

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

Micro requires node v7.6.0 or higher for ES2015 and async function support, also requires docker.

```
$ npm install microless --save
```

## Getting started

### init

``` javascript

const routers = {
  '/': {
    afterRoute: function(ctx, next) {
      ctx.body = 'index api 0.1';
    },
    method: 'get'
  }
}

var opts = {

  withDocker: true, //whether use docker for microservice, default is true

  services: [{
    image: 'node', //docker image, default is ubuntu
    name: 'test', //docker name
    containerPort: 4567, //container port
    hostPort: 9999, //host port
    host: 'http://localhost', //host
    src: 'test', //service source code
    cmd: ['node index.js'],//will be executed when docker starting
    router: {
      configs: routers,
      onError: function(ctx, next, error) {
        ctx.body = error;
      }
    }
  }, {
    name: 'tests',
    containerPort: 4567,
    hostPort: 4001
  }]

}

var myMicroService = new Micro(opts);

```

This will run the service in a docker container named ```'micro_example'```.


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

### Run the project

``` javascript

myMicroService.run(3001);

```

Then the project will run in port 3001, and every stopped docker will be started when the project is running.

![run](https://github.com/Authing/micro.js/blob/master/assets/run.png?raw=true)
