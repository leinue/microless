const Koa = require('koa');
const Router = require('koa-router');
const Route = require('../router.js');

const koaBody = require('koa-body');
const Service = require('./service.js');

const logging = require('../utils/logging.js');
const YAML = require('yamljs');

var Micro = function(opts) {
	this.withDocker = !opts.withDocker ? false : true;

	this.servicesConfig = opts.services || [];

	this.initKoa();

	if(this.withDocker) {
		this.initService();
	}

	if(opts.compose) {
		this.compose = opts.compose;
		this.parseCompose();
	} 
}

Micro.prototype = {

	initKoa: function() {

		const app = new Koa();
		const router = new Router();

		app.use(koaBody());

		for (var i = 0; i < this.servicesConfig.length; i++) {
			var serviceConfig = this.servicesConfig[i];

			if(!serviceConfig.router) {
				continue;
			}

			Route({
				router: {
					instance: router,
					configs: serviceConfig.router.configs || {},
					routeNotFound: serviceConfig.router.routeNotFound,
					methodNotSupported: serviceConfig.router.methodNotSupported,
					onError: serviceConfig.router.onError
				},
				service: serviceConfig
			});

		};

		app.use(router.routes());

		this.router = router;
		this.app = app;
		this.koa = app;
		this.koaBody = koaBody;
	},

	initService: function() {
		this.service = new Service(this.servicesConfig);
	},

	parseCompose: function() {
		var composeConfig = YAML.load(this.compose.src);

		if(!composeConfig['services']) {
			logging('[Warning]: docker compose file lost services')
		}

		for(var serviceName in composeConfig['services']) {
			var service = composeConfig['services'][serviceName];

			if(!service['ports']) {
				throw '[Error]: microless service must has exposed port in docker-compose file'
			}

			


		}
	},

	run: function(opts, cb) {
		opts.port = opts.port || 3000;
		this.app.listen(opts.port, (a, b) => {
			if(cb) {
				cb(logging)
			}
		});
	}
}

module.exports = Micro;
