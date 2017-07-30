const dockerReq = require('request');
const logging = require('./utils/logging.js');

const handleDockerRequest = function(ctx, next, service) {
	return new Promise((resolve, reject) => {

		var options = {
		  url: service.host + ':' + service.port || 'http://localhost:' + service.port,
		  method: ctx.method,
		  headers: ctx.header
		};

		function callback(error, response, body) {

			if(error) {
				reject(error);
			}

		  	if (!error && response.statusCode == 200) {
		    	// var info = JSON.parse(body);
		    	resolve(body);
		  	}
		}

		dockerReq(options, callback);
	});
}

var route = function (opts) {

	var router = opts.router.instance,

		routerConfigs = opts.router.configs,

		service = opts.service;

	const connectDB = () => {
		var db = mongoose.connection;

		db.on('error', (error) => {

			console.log('mongodb connected failed', error);

			router.get('*', function (ctx, next) {
				ctx.status = 500;
			});		
		});

		db.once('open', () => {
			console.log('mongodb connected successfully, routing list loaded');
		});

	}

	const generateRoutes = (routerConfigs) => {
		for (var key in routerConfigs) {
			var request = routerConfigs[key];
			if(request.subRoute) {
				generateRoutes(request.subRoute);
			}
			router[request.method](key, (ctx, next) => {
				return handleDockerRequest.call(ctx, ctx, next, service).then((body) => {
					if(this.currentRequestConfig.afterRoute) {
						this.currentRequestConfig.afterRoute.call(ctx, ctx, next, {
							body: body
						});
					}else {
						ctx.body = body;
					}

				}).catch((error) => {
					if(opts.router.onError) {
						opts.router.onError.call(ctx, ctx, next, error);
					}else {
						ctx.body = error;
					}

					if(this.currentRequestConfig.onError) {
						this.currentRequestConfig.onError.call(ctx, ctx, next, error);						
					}else {
						ctx.body = error;
					}
				});
			});
		};	
	}

	const getRouterFromRouterConfigs = (routerConfigs, ctxRouter) => {
		for (var key in routerConfigs) {
			var request = routerConfigs[key];
			if(request.subRoute) {
				return getRouterFromRouterConfigs(request.subRoute, ctxRouter);
			}
			if(ctxRouter == key) {
				return routerConfigs[key];
			}
		}
		return undefined;
	}

	if(opts.database) {
		connectDB();
	}

	router.all('*', function (ctx, next) {
		this.router = router;

		var routerExistsFlag = -1;

		logging(ctx.method + 'request for: ' + ctx.originalUrl);

		for (var j = 0; j < this.router.stack.length; j++) {
			var routerStack = this.router.stack[j];

			if(routerStack.path == '*') {
				continue;
			}

			var isHitRoute = new RegExp(routerStack.regexp).test(ctx.originalUrl);

			if(isHitRoute) {
				routerExistsFlag ++;
				var path = routerStack.path;

				this.currentRequestConfig = getRouterFromRouterConfigs(routerConfigs, path);

				if(ctx.method.toLowerCase() != this.currentRequestConfig.method.toLowerCase()) {
					if(opts.router.methodNotSupported) {
						opts.router.methodNotSupported.call(this, ctx, next)
					}else {
						ctx.body = '[micro error]: ' + ctx.method + ' is not supported for this method';					
					}
				}

				ctx.body = '[micro error]: It seems that [' + ctx.originalUrl + '] is not returning data.You can use `ctx.body = ""` to return data';

				return next();
			}
		};

		if(routerExistsFlag < 0) {
			if(opts.router.routeNotFound) {
				opts.router.routeNotFound.call(this, ctx, next)
			}else {
				ctx.body = '[micro error]: ' + ctx.originalUrl + ' not found';
			}
		}

		return next();
	});

	generateRoutes(routerConfigs);
}

module.exports = route;
