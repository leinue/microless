const Koa = require('koa');
const app = new Koa();
const Docker = require('dockerode');

var Micro = function() {
	this.serviceList = [];
	this.databaseList = [];
}

Micro.prototype = {

	run: function(params, cb) {

		params.port = params.port || 3000;

		app.use(ctx => {
		  ctx.body = 'Hello Koa';
		});

		app.listen(params.port, cb);

		this.initDocker();
	},

	initDocker: function() {
		var docker = new Docker();
		console.log(docker);
		docker.listContainers(function(err, containers) {
			console.log(containers);
		});
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
