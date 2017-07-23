const Micro = require('../src');

const routers = {
	'/': {
		path: '/',
		controller: function(ctx, next) {
			ctx.body = 'index api 0.1';
		},
		name: 'index',
		alias: 'index',
		method: 'get',
		children: {
			'/fuck': {
				path: '/fuck',
				controller: function(ctx, next) {
					ctx.body = 'fuck api 0.1';
				},
				name: 'index',
				alias: 'index',
				method: 'get'
			}
		}
	},

	'/shit/:id': {
		path: '/shit/:id',
		controller: function(ctx, next) {
			console.log('shit');
			ctx.body = 'shit api 0.1';
		},
		name: 'shit',
		alias: 'shit',
		method: 'get'	
	}
}

var micro = new Micro({
	routers: routers
});

micro.run({
	port: 3001
}, () => {
	console.log('[' + Date() + ']: ' + 'example is running on port 3001');
});
