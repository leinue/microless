const Koa = require('koa');
const Router = require('koa-router');
const Route = require('../router.js');

const koaBody = require('koa-body');
const Service = require('./service.js');

const logging = require('../utils/logging.js');
const YAML = require('yamljs');

const Swarm = require('./swarm/index.js');
const randomString = require('../utils/randomString.js');

const exec = require('child_process').exec;

var Micro = function(opts) {

	this.serviceConfigs = [];
	this.modems = opts.modems;
	this.projectName = opts.name || randomString(8);

	if(opts.compose) {
		this.composeInfo = opts.compose || {
			src: './docker-compose.yml',
			dockerfile: '.'
		};

		this.composeInfo.src = this.composeInfo.src || './docker-compose.yml';
		this.composeInfo.dockerfile = this.composeInfo.dockerfile || '.';

		this.parseCompose(() => {

			logging('deploying containers....')

			this.swarm = new Swarm();

			this.swarm.deploy(this.projectName)
			.then((data) => {
				logging('deploying containers success');
				logging('start to get koa instance...');
				this.initKoa();
				this.run(opts.server, opts.onSuccess);
			})
			.catch((error) => {
				logging('[Error]:', error);
				if(opts.onError) {
					opts.onError(error);
				}
			});

		});

	} 
}

Micro.prototype = {

	parseCompose: function(cb) {

		var composeConfig = YAML.load(this.composeInfo.src);

		if(!composeConfig['services']) {
			logging('[Warning]: docker compose file lost services')
		}

		var count = 0,
 			len = 0;

		for(var serviceName in composeConfig['services']) {
			var service = composeConfig['services'][serviceName];

			if(!service['ports']) {
				throw '[Error]: microless service must have exposed port in docker-compose file'
			}

			var ports = service.ports[0].split(':');

			this.serviceConfigs.push({
				containerPort: ports[1],
				hostPort: ports[0],
				name: serviceName,
				image: service.image
			});

			len++

			exec('cd ' + process.cwd() + ' && docker build -t ' + service.image + ' ' + this.composeInfo.dockerfile, { t: 'service.image' }, (err, response) => {
				if(err) {
					throw err
				}

				count++;

				logging('build image', service.image);

				if(cb && count == len) {
					logging('load yaml and build images success, detail:', this.serviceConfigs);
					cb();
				}

			});

		}

	},

	initKoa: function() {

		const app = new Koa();
		const router = new Router();

		app.use(koaBody());

		for (var i = 0; i < this.serviceConfigs.length; i++) {
			var serviceConfig = this.serviceConfigs[i];

			Route({
				router: {
					instance: router,
					modem: this.modems[serviceConfig.name]
				},
				service: serviceConfig
			});

		};

		app.use(router.routes());

		this.router = router;
		this.app = app;
		this.koa = app;
		this.koaBody = koaBody;

		logging('get koa instance success');
	},

	initService: function() {
		this.service = new Service(this.serviceConfigs);
	},

	run: function(opts, cb) {
		opts.port = opts.port || 3000;
		this.app.listen(opts.port, (a, b) => {
			if(cb) {
				cb(logging)
			}else {
				logging('server started success, running at port ' + opts.port);
			}
		});
	}
}

module.exports = Micro;
