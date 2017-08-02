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
