const Docker = require('dockerode');

var Service = function(serviceList) {

	this.serviceList = serviceList;

	this.docker = new Docker();
	this.docker.listContainers(function(err, containers) {
		// console.log(containers);
	});

	this.register();
}

Service.prototype = {

	register: function() {
		for (var i = 0; i < this.serviceList.length; i++) {
			var service = this.serviceList[i];

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
					this.serviceList[i].registered = false;
				}
			}
		};
	},

	isServiceParamsExists: function(param, value) {
		var count = 0;
		for (var i = 0; i < this.serviceList.length; i++) {
			var service = this.serviceList[i];
			if(service[param] == value) {
				count++;
			}
		};
		return count === 1 || count === 0 ? false : true;
	},

	generatePort: function() {

	}

}

module.exports = Service;
