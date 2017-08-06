![arch](https://github.com/Authing/micro.js/blob/master/assets/logo.png?raw=true)

Microless是一个基于node.js koa的微服务框架，旨在让开发者快速开发基于容器架构的微服务Web程序和API接口。Microless基于koa.js，所以所有的koa中间件都以正常使用。

## 特性

> 让微服务触手可及

![arch](https://github.com/Authing/micro.js/blob/master/assets/Architecture.png?raw=true)

1. 使用docker stack deploy和docker swarm部署基于docker的微服务
2. 通过JSON字符串和RESTful API在微服务之间交换数据
3. 每一个微服务都可以拥有自己的数据库（在docker-compose文件中配置即可）
4. API网关作为控制单元，可以在这里做一些通用操作，比如炎症或日志记录
5. 轻松使用koa中间件

## 安装

### 安装 Docker

请参考Docker官方文档 [docker doc](https://docs.docker.com/get-started)

**注意:** ```docker swarm``` 和 ``` docker-compose ``` 是必须要安装的。

### 安装 Microless

Microless 需要 node v7.6.0 或者更高版本，为了使用ES2015和async function相关功能。

```
$ npm install microless --save
```

## 起步走

这个例子展现了使用microless启动一个python微服务的能力，你可以在 [example](https://github.com/Authing/microless/tree/master/example) 中找到代码。

### 编写Python代码

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

这个程序将会运行在80端口（容器内）。

### 编写 Dockerfile

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

这个Dockerfile定义了一个运行在80端口的python程序，同时需要flask框架。

### 编写 Compose 文件

Save as ```docker-compose.yml```

``` shell

version: "2"
services:
  web:
    image: 'example_web'
    build: .
    ports:
      - "4000:80"

```
这个docker-compose文件启动了一个名叫```web```的容器，暴露了宿主机端口4000，指向容器内的80端口。

更多关于docker-compose的使用方法请参考：[docker文档](http://docker.com).

### 编写 Microless 代码

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

  name: 'test', //project name

  compose: {
    src: './docker-compose.yml' //docker compose file
    dockerfile: '.'
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

这个程序将会运行在3001端口。

当你访问 ```http://locahost:3001```时，你会发现由python微服务传回来的数据，实际上运行在``` http://localhost:4000```上。microless的路由功能会选择正确的微服务并返回正确的response（包括header等信息）。

![run](https://github.com/Authing/microless/blob/master/assets/run.png?raw=true)

## 其它配置

### Compose

Compose定义了 ```docker-compose``` 和 ```dockefile```的地址

``` javascript

  compose: {
    src: './docker-compose.yml', //default is './docker-compose.yml'
    dockerfile: '.' //dockerfile directory, default is .
  }

```

### 路由（Modems）

路由的功能主要是到微服务的路径，每一个从```http://locahost:3001```发出去的请求将会自动路由到正确的微服务商，所以在microless中的路由配置必须和在微服务中的路由定义完全一样，因为microless会将HTTP请求完全转发。

举个例子，如果你在docker-compose文件中定义了一个名叫```web```的服务，你必须将web作为microless配置中的modems的一个键：

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

#### 路由配置

一个标准的路由类似这样：

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

路由配置有两个属性

1. ```method```: **必需**, 定义HTTP请求方式
2. ```afterRoute```: **可选**, 路由结束后被调用，你可以在这里处理从微服务得到的数据。一旦启用了这个方法，必需要写```ctx.body = xxx```，否则你将会看到一个空白页面。

P.S. 路由系统用的是koa-router中间件

#### 路由错误处理

目前，microless拥有三种错误处理方式：

``` javascript

  modems: {
    web: {
      configs: routers,

      //当路由出错时调用
      onError: function(ctx, next, error) {
        ctx.body = error;
      },

      //当方法不被支持时调用
      methodNotSupported: function(ctx, next, error) {

      },

      //当路由未找到时调用
      routeNotFound: function(ctx, next, error) {

      }
    }
  }

```

1. ```onError```: **可选**, 当路由出错时调用。
2. ```methodNotSupported```: **可选**, 当方法不被支持时调用。
3. ```routeNotFound```: **可选**, 当路由未找到时调用。

### Server

Server只有一个属性：

1. ```port```: **必需**, 定义整个服务的启动端口。

### 错误处理

1. ```onSuccess```: **可选**, 当执行docker-compose成功时被调用
2. ```onError```: **可选**, docker-compose执行失败时被调用

一个完整的启动代码类似这样:

``` javascript

const Micro = require('../src');

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

  name: 'test',

  compose: {
    src: './docker-compose.yml',
    dockerfile: '.'
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
  // onSuccess: function() {

  // },

  //called when exectuing docker-compose failed
  onError: function(error) {
    console.log(error);
  }
});


```

Enjoy your microservice with docker and nodejs :)

For more visit author's website: [ivydom](http://ivydom.com)
