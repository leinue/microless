const Micro = require('../src');

const routers = {
	'/': {
		controller: function(ctx, next, response) {
			ctx.body = response.body;
		},
		name: 'index',
		alias: 'index',
		method: 'get'
	},

	'/shit/:id': {
		controller: function(ctx, next) {
			ctx.body = 'shit api 0.1, params=' + JSON.stringify(this.params);
		},
		name: 'shit',
		alias: 'shit',
		method: 'get'
	}
}

var micro = new Micro({
	router: {
		configs: routers,
		onError: function(ctx, next, error) {
			ctx.body = error;
		}
	}
});

// micro.registerService();

micro.run({
	port: 3001
}, () => {
	console.log('[' + Date() + ']: ' + 'example is running on port 3001');
});
