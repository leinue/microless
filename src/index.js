const Koa = require('koa');
const Router = require('koa-router');
const Route = require('./router.js');

const koaBody = require('koa-body');
const Docker = require('dockerode');

var Micro = function(opts) {
	this.serviceList = [];
	this.databaseList = [];

	this.opts = opts;

	this.initKoa();
	this.initDocker();
}

Micro.prototype = {

	initKoa: function() {

		const app = new Koa();
		const router = new Router();

		app.use(koaBody());

		Route({
			router: {
				instance: router,
				configs: this.opts.routers || [],
				routeNotFound: this.opts.routeNotFound
			}
		});

		app.use(router.routes());

		this.router = router;
		this.app = app;
		this.koaBody = koaBody;
	},

	initDocker: function() {
		this.docker = new Docker();
		this.docker.listContainers(function(err, containers) {
			// console.log(containers);
		});
	},

	run: function(params, cb) {
		params.port = params.port || 3000;
		this.app.listen(params.port, cb);
	},

	registerService: function(params, cb) {
		this.serviceList.push({
			name: params.name
		});

		return this;
	},

	registerDatabase: function(serviceName, dbName, cb) {

		return this;
	}
}

module.exports = Micro;
