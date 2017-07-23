const Micro = require('../src');

const routers = {
	'/': {
		afterRoute: function(ctx, next, response) {
			ctx.body = response.body;
		},
		name: 'index',
		alias: 'index',
		method: 'get'
	},

	'/shit/:id': {
		afterRoute: function(ctx, next) {
			ctx.body = 'shit api 0.1, params=' + JSON.stringify(this.params);
		},
		name: 'shit',
		alias: 'shit',
		method: 'get'
	}
}

var micro = new Micro({

	services: [{
		name: 'test',
		port: 9999,
		host: 'http://gospely.com',
		src: './',
		router: {
			configs: routers,
			onError: function(ctx, next, error) {
				ctx.body = error;
			}
		}
	}, {
		name: 'tests',
		port: 4001
	}]

});

micro.run({
	port: 3001
}, () => {
	console.log('[' + Date() + ']: ' + 'example is running on port 3001');
});
