![arch](https://github.com/Authing/micro.js/blob/master/assets/logo.png?raw=true)

Microservice framework for node.js to make container-based microservice web applications and APIs more enjoyable to write. Micro is based on koa.js, allowing you to use all the features that koa has.

## Features

> Make microservice reachable 

![arch](https://github.com/Authing/micro.js/blob/master/assets/Architecture.png?raw=true)

1. Deploying microservices with docker containers, using docker-compose and docker swarm
2. Transferring the data between the services via JSON strings and RESTful API
3. Every single serivice has it's own database
4. API Gateway serves as the controlling unit, which controls the whole system.You can do some universal works like auth or log
5. Using docker-compose to compose containers
6. Easily using docker swarm mode
7. Easily Integrated with koa middlewares

## Installation

Micro requires node v7.6.0 or higher for ES2015 and async function support, also requires [docker](http://docker.com).

```
$ npm install microless --save
```

## Getting started

The example shows the ability to start a python container using microless, you can get the source code in folder [example](https://github.com/Authing/microless/tree/master/example)

### Write Python Code

``` python

from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    html = "<h3>Hello {name}!</h3>"
    return html.format(name="world")

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)

```

This program will run a python server at port 80.

### Write Dockerfile

``` shell

# Use an official Python runtime as a parent image
FROM python:2.7-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Install any needed packages specified in requirements.txt
RUN pip install Flask

# Make port 80 available to the world outside this container
EXPOSE 80

# Run app.py when the container launches
CMD ["python", "app.py"]

```

This Dockerfile defines a image which can start a python server at port 80.

### Write Compose File

Save as ```docker-compose.yml```

``` shell

version: "2"
services:
  web:
    build: .
    ports:
      - "4000:80"
    networks:
      - webnet

```
This compose file starts a python container called ```web``` with exposed port ```4000```, which uses the above ```Dockerfile```.

For more details please visit [docker docs](http://docker.com).

### Write Microless Code

``` javascript

// import microless
const Micro = require('microless');

// config restful api routers
const routers = {
  '/': {
    method: 'get' // define the request method
  }
}

var micro = new Micro({

  compose: {
    src: './docker-compose.yml' //docker compose file
  },

  // router to microservice  
  modems: {

    // name in docker compose files
    web: {
      configs: routers,
    }

  },

  server: {
    port: 3001
  }
});

```

This will run the service in a docker container named ```'example_web_1'```.

Then the project will run at port 3001.

When you visit ```http://locahost:3001```, you will see the result from python programs, every single request from ```http://locahost:3001``` will automatically router to the right microservice.

![run](https://github.com/Authing/micro.js/blob/master/assets/getting-started.png?raw=true)

## Other Configs

### Compose

Compose defines the src of ```docker-compose``` file.

``` javascript

  compose: {
    src: './docker-compose.yml'
  }

```

### Modems

Modems mainly defines the router to microservice. Every single request from ```http://locahost:3001``` will automatically router to the right microservice, so your router configs in the microless must ```as same as``` the router defined in the microservice.

For example, if you define a container called ```web``` in docker-compose.yml, you must write ```web``` as a ```key``` in modems like this:

``` javascript

  modems: {
    web: {
      configs: routers
    },

    a: {
      configs: aRouters
    },

    ...
  }

```

#### Router Configs

A symbol config is like this:

``` javascript

  const routers = {
    '/': {
      //called when route ends
      afterRoute: function(ctx, next, response) {
        ctx.body = response.body;
      },
      method: 'get'
    },

    '/shit/:id': {
      //called when route ends
      afterRoute: function(ctx, next) {
        ctx.body = 'shit api 0.1, params=' + JSON.stringify(this.params);
      },
      method: 'get'
    }
  }

```

There are two attributes that router config has:

1. ```method```: **required**, defines a http request method
2. ```afterRoute```: **optional**, called when route ends, you can handle the result from microservice and display it in other way.when you use this attribute, you must write ```ctx.body = xxx```, otherwise you would see a blank page.

P.S. The router follows the koa-router.

#### Error Handling in Modems

Currently, microless has three error handling methods when modem to a microservice:

``` javascript

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
  }

```

1. ```onError```: **optional**, called when modem on error.
2. ```methodNotSupported```: **optional**, called when method not supported.
3. ```routeNotFound```: **optional**, called when route not found.

### Server

Server just has one attribute:

1. ```port```: **required**, defines the main port of the service.

### Error Handling

1. ```onSuccess```: **optional**, called when successfully exectuing docker-compose
2. ```onError```: **optional**, called when exectuing docker-compose failed

A complete start code is like this:

``` javascript

const Micro = require('microless');

const routers = {
  '/': {
    //called when route ends
    afterRoute: function(ctx, next, response) {
      ctx.body = response.body;
    },
    method: 'get'
  },

  '/shit/:id': {
    //called when route ends
    afterRoute: function(ctx, next) {
      ctx.body = 'shit api 0.1, params=' + JSON.stringify(this.params);
    },
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
  onError: function(error) {
    console.log(error);
  }
});

```

