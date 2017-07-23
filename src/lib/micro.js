const Koa = require('koa');
const Router = require('koa-router');
const Route = require('../router.js');

const koaBody = require('koa-body');
const Service = require('./service.js');

var Micro = function(opts) {
	this.serviceList = opts.services || [];
	this.databaseList = [];

	this.opts = opts;

	this.initKoa();
	this.initService();
}

Micro.prototype = {

	initKoa: function() {

		const app = new Koa();
		const router = new Router();

		app.use(koaBody());

		Route({
			router: {
				instance: router,
				configs: this.opts.router.configs || {},
				routeNotFound: this.opts.router.routeNotFound,
				methodNotSupported: this.opts.router.methodNotSupported,
				onError: this.opts.router.onError
			}
		});

		app.use(router.routes());

		this.router = router;
		this.app = app;
		this.koaBody = koaBody;
	},

	initService: function() {
		this.service = new Service(this.serviceList);
	},

	run: function(opts, cb) {
		opts.port = opts.port || 3000;
		this.app.listen(opts.port, cb);
	},

	registerService: function(services, cb) {

		for (var i = 0; i < services.length; i++) {
			var service = services[i];
			service.registered = false;
			this.serviceList.push(service);
		};

		return this;
	},

	registerDatabase: function(serviceName, dbName, cb) {

		return this;
	}
}

module.exports = Micro;
