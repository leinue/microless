![arch](https://github.com/Authing/micro.js/blob/master/assets/logo.png?raw=true)

Microservice framework for node.js to make container-based microservice web applications and APIs more enjoyable to write. Micro is based on koa.js, allowing you to use all the features that koa has.

## Features

> Make microservice reachable 

![arch](https://github.com/Authing/micro.js/blob/master/assets/Architecture.png?raw=true)

1. Deploying microservices with docker containers
2. Transferring the data between the services via JSON strings and RESTful API
3. Every single serivice has it's own database
4. API Gateway serves as the controlling unit, which controls the whole system.You can do some universal works like auth or log
5. Using docker-compose to compose containers
6. Easily using docker swarm mode
7. Easily Integrated with koa middlewares
8. DevOps supported

## Installation

Micro requires node v7.6.0 or higher for ES2015 and async function support, also requires docker.

```
$ npm install microless --save
```

## Getting started

### init

``` javascript

const Micro = require('../src');

const routers = {
  '/': {
    //called when route ends
    afterRoute: function(ctx, next, response) {
      ctx.body = response.body;
    },
    name: 'index',
    alias: 'index',
    method: 'get'
  },

  '/shit/:id': {
    //called when route ends
    afterRoute: function(ctx, next) {
      ctx.body = 'shit api 0.1, params=' + JSON.stringify(this.params);
    },
    name: 'shit',
    alias: 'shit',
    method: 'get'
  }
}

var micro = new Micro({

  compose: {
    src: './docker-compose.yml'
  },

  modems: {
    web: {
      configs: routers,

      //called when modem on error
      onError: function(ctx, next, error) {
        ctx.body = error;
      },

      //called when method not supported
      methodNotSupported: function(ctx, next, error) {

      },

      //called when route not found
      routeNotFound: function(ctx, next, error) {

      }
    }
  },

  server: {
    port: 3001
  },

  //called when successfully exectuing docker-compose
  onSuccess: function() {

  },

  //called when exectuing docker-compose failed
  onError: function() {

  }
});


```

This will run the service in a docker container named ```'microless_test'```.

Then the project will run in port 3001, and every stopped docker will be started when the project is running.

![run](https://github.com/Authing/micro.js/blob/master/assets/run.png?raw=true)
