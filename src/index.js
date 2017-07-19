const Koa = require('koa');
const app = new Koa();

var Micro = function() {}

Micro.prototype = {

	run: function(params, cb) {

		app.use(ctx => {
		  ctx.body = 'Hello Koa';
		});

		app.listen(params.port, cb);
	},

	registerService: function(name, cb) {

	},

	registerDatabase: function(serviceName, dbName, cb) {

	}
}

module.exports = Micro;
