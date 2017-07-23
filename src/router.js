const postJSON = require('./utils/postJSON.js');
const setJSON = require('./utils/setJSON.js');

module.exports = function (opts) {

	var router = opts.router.instance,

		routerConfigs = opts.router.configs;

	const connectDB = () => {
		var db = mongoose.connection;

		db.on('error', (error) => {

			console.log('mongodb connected failed', error);

			router.get('*', function (ctx, next) {
				this.postJSON = postJSON(ctx);
				ctx.status = 500;
				this.postJSON(500, '数据库连接失败');
			});		
		});

		db.once('open', () => {
			console.log('mongodb connected successfully, routing list loaded');
		});

	}

	if(opts.database) {
		connectDB();
	}

	const notFound = (ctx, request) => {
		ctx.body = request.path + ' not found';
	}

	router.all('*', function (ctx, next) {
		this.router = router;
		return next();
	});

	for (var key in routerConfigs) {
		var request = routerConfigs[key];

		router[request.method](request.path, (ctx, next) => {
			for (var j = 0; j < this.router.stack.length; j++) {
				var routerStack = this.router.stack[j];
				var isHitRoute = new RegExp(routerStack.regexp).test(ctx.originalUrl);

				if(routerStack.path != '*') {
					if(isHitRoute) {
						console.log('[' + Date() + ']: ' + request.method + ' request for: ' + ctx.originalUrl);						
						var path = routerStack.path;
						routerConfigs[path].controller.call(this, ctx, next);
						break;
					}
				}

			};
		});
	};

}