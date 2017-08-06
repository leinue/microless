const dockerReq = require('request');
const logging = require('./utils/logging.js');

const handleDockerRequest = function(ctx, next, service) {
	return new Promise((resolve, reject) => {

		const url = (service.host || 'http://localhost') + ':' + service.hostPort || 'http://localhost:' + service.hostPort

		var options = {
		  url: url,
		  method: ctx.method,
		  headers: ctx.header
		};

		function callback(error, response, body) {

			if(error) {
				reject(error);
			}

		  	if (!error && response.statusCode == 200) {
		    	resolve({
		    		response,
		    		body
		    	});
		  	}
		}

		dockerReq(options, callback);
	});
}

var route = function (opts) {

	var router = opts.router.instance,

		modem = opts.router.modem,

		routerConfigs = modem.configs,

		service = opts.service;

	const generateRoutes = (routerConfigs) => {
		for (var key in routerConfigs) {
			var request = routerConfigs[key];
			if(request.subRoute) {
				generateRoutes(request.subRoute);
			}
			router[request.method](key, (ctx, next) => {
				return handleDockerRequest.call(ctx, ctx, next, service)
				.then((opts) => {
					ctx.set(opts.response.headers);
					
					if(this.currentRequestConfig.afterRoute) {
						this.currentRequestConfig.afterRoute.call(ctx, ctx, next, {
							body: opts.body,
							response: opts.response
						});
					}else {
						console.log(opts.response.headers);
						ctx.body = opts.body;
					}

				})
				.catch((error) => {
					if(modem.onError) {
						modem.onError.call(ctx, ctx, next, error);
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

		logging(ctx.method, 'request for: ' + ctx.originalUrl);

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
					if(modem.methodNotSupported) {
						modem.methodNotSupported.call(this, ctx, next)
					}else {
						ctx.body = '[micro error]: ' + ctx.method + ' is not supported for this method';					
					}
				}

				ctx.body = '[micro error]: It seems that [' + ctx.originalUrl + '] is not returning data.You can use `ctx.body = ""` to return data';

				return next();
			}
		};

		if(routerExistsFlag < 0) {
			if(modem.routeNotFound) {
				modem.routeNotFound.call(this, ctx, next)
			}else {
				ctx.body = '[micro error]: ' + ctx.originalUrl + ' not found';
			}
		}

		return next();
	});

	generateRoutes(routerConfigs);
}

module.exports = route;
