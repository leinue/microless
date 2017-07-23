
var route = function (opts) {

	var router = opts.router.instance,

		routerConfigs = opts.router.configs;

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
				this.currentRequestConfig.controller.call(this, ctx, next);
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

		console.log('[' + Date() + ']: ' + ctx.method + ' request for: ' + ctx.originalUrl);

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

				if(ctx.method != this.currentRequestConfig.method) {
					if(opts.router.methodNotSupported) {
						opts.router.methodNotSupported.call(this, ctx, next)
					}else {
						ctx.body = '[micro error]: ' + ctx.method + ' is not supported for this method';					
					}
				}

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
