const postJSON = require('./utils/postJSON.js');
const setJSON = require('./utils/setJSON.js');
// const Controllers = require('./controllers');

module.exports = function (router, mongoose) {

	// var db = mongoose.connection;

	router.get('/', function (ctx, next) {
		ctx.body = setJSON(200, 'pixweb api 0.1');
	});

	// db.on('error', (error) => {

	// 	console.log('mongodb connected failed', error);

	// 	router.get('*', function (ctx, next) {
	// 		this.postJSON = postJSON(ctx);
	// 		ctx.status = 500;
	// 		this.postJSON(500, '数据库连接失败');
	// 	});		
	// });
	// db.once('open', () => {

	// 	console.log('mongodb connected successfully, routing list loaded');

	// 	// var ctrl = new Controllers(mongoose);

	// 	router.all('*', function (ctx, next) {
	// 		this.postJSON = postJSON(ctx);
	// 		this.setJSON = setJSON;
	// 		// this.ctrl = ctrl;
	// 		this.router = router;
	// 		this.mongoose = mongoose;
	// 		return next();
	// 	});

	// 	var routerConfigs = {
	// 		users: [{
	// 			action: 'login',
	// 			method: 'post',
	// 			params: []
	// 		}, {
	// 			action: 'register',
	// 			method: 'post',
	// 			params: []
	// 		}, {
	// 			action: 'exists',
	// 			method: 'get',
	// 			params: ['email']
	// 		}],

	// 		templates: [{
	// 			action: 'list',
	// 			method: 'get',
	// 			params: ['page', 'count']
	// 		}, {
	// 			action: 'upload',
	// 			method: 'post',
	// 			params: []
	// 		}, {
	// 			action: 'uploadTheme',
	// 			method: 'post',
	// 			params: []
	// 		}, {
	// 			action: 'uploadThemeImage',
	// 			method: 'post',
	// 			params: []
	// 		}, {
	// 			action: 'download',
	// 			method: 'get',
	// 			params: ['_id']
	// 		}],

	// 		downloads: [{
	// 			action: 'count',
	// 			method: 'get',
	// 			params: []
	// 		}]
	// 	}

	// 	for (var models in routerConfigs) {
	// 		var currentModelActions = routerConfigs[models];
	// 		for (var i = currentModelActions.length - 1; i >= 0; i--) {
	// 			var request = currentModelActions[i],

	// 				url = '/' + [models, request.action].join('/'),
	// 				params = request.params.length > 0 ? '/:' + request.params.join('/:') : ''

	// 			router[request.method](url + params, (ctx, next) => {

	// 				var originalUrl = ctx.originalUrl.split('/');

	// 				if(!this.ctrl[originalUrl[1]]) {
	// 					this.status = 500;
	// 					ctx.body = this.setJSON(500, '服务器提了一个问题：模型 [' + originalUrl[1] + '] 未定义');
	// 					return false;
	// 				}

	// 				if(!this.ctrl[originalUrl[1]][originalUrl[2]]) {
	// 					this.status = 500;
	// 					ctx.body = this.setJSON(500, '服务器提了一个问题：模型 [' + originalUrl[1] + '] 内方法 [' + originalUrl[2] + '] 未定义');
	// 					return false;
	// 				}

	// 				return this.ctrl[originalUrl[1]][originalUrl[2]].call(this, ctx).then((response) => {
	// 					ctx.body = response;
	// 				}).catch(function(error) {
	// 					// ctx.status = 500;
	// 					ctx.body = error;
	// 				});
					
	// 			});
	// 		};
	// 	}

	// });

}