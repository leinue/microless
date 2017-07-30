const Docker = require('dockerode');
const fs     = require('fs');
const logging = require('../utils/logging.js');

var Service = function(serviceList) {

	this.serviceList = serviceList;

	var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
	// var stats  = fs.statSync(socket);

	// if (!stats.isSocket()) {
	//   throw new Error('Are you sure the docker is running?');
	// }

	this.docker = new Docker();
	this.docker.listContainers(function(err, containers) {
		logging('list-containers:', containers);
	});

	this.register();
}

Service.prototype = {

	register: function() {
		for (var i = 0; i < this.serviceList.length; i++) {
			var service = this.serviceList[i];

			service.type = service.type || 'default';

			if(!service.name) {
				throw '[microless error]: service name is required';				
			}

			if(!service.port) {
				throw '[microless error]: service port is required';
			}

			if(this.isServiceParamsExists('name', service.name)) {
				throw '[microless error]: service name [' + service.name + '] duplicated';
			}else {

				if(this.isServiceParamsExists('port', service.port)) {
					throw '[microless error]: service port [' + service.port + '] duplicated';
				}else {

					this.registerDocker(service, i);

					this.serviceList[i].registered = false;
				}
			}
		};
	},

	registerDocker: function(service, i) {

		var self = this;

		logging('\r\n', '\r\n', 'Register Docker: ' , '\r\n' , service, '\r\n');

		this.docker.createContainer({
		  	Image: 'ubuntu',
		  	name: 'microless_' + service.name,
		  	volume: '',
		  	Cmd: ['/bin/bash'],
		}).then((container) => {
			logging('Register Docker: ', service.name , 'Succeed');
		  	return container.start().then(() => {
		  		this.serviceList[i].container = container;
		  	});
		}).catch((err) => {
			logging('\r\n', '\r\n', 'Register Failed', '\r\n', err);
		  	throw new Error(err);
		});
	},

	unregister: function(name) {
		var serviceInfo = this.getServiceByServiceName(name);
		this.serviceList.splice(serviceInfo.index, 1);
		return this.unregisterDocker(serviceInfo.info);
	},

	unregisterDocker: function(service) {
		return service.remove()
	},

	isServiceParamsExists: function(param, value) {
		var count = 0;
		for (var i = 0; i < this.serviceList.length; i++) {
			var service = this.serviceList[i];
			if(service[param] == value) {
				count ++;
			}
		};
		return count === 1 || count === 0 ? false : true;
	},

	getServiceByServiceName: function(name) {
		for (var i = 0; i < this.serviceList.length; i++) {
			var service = this.serviceList[i];
			if(service.name == name) {
				return {
					index: i,
					info: service
				}
			}
		};
	}

}

module.exports = Service;
