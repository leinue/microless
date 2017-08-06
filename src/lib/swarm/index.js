const exec = require('child_process').exec;
const logging = require('../../utils/logging.js')

var Swarm = function() {}

Swarm.prototype = {

	deploy: function(projectName) {
		return new Promise((resolve, reject) => {
			var command = 'cd ' + process.cwd() + ' && docker swarm leave --force && docker swarm init';
			logging('exectuing: ', command, '...');
			exec(command, (error, data) => {
				if (error) {
					logging('leave docker swarm failed, trying to retry...');
					var command = 'cd ' + process.cwd() + ' && docker swarm init';
					logging('exectuing: ', command, '...');
					exec(command, (error, data) => {
						if (error) {
							reject(error);
						}else {
							logging('init swarm success');							
							this.stackDeploy(projectName)
							.then((data) => {
								resolve(data);
							})
							.catch((error) => {
								reject(error);
							});
						}
					});
				}else {
					logging('init swarm success');

					this.stackDeploy(projectName)
					.then((data) => {
						resolve(data);
					})
					.catch((error) => {
						reject(error);
					});
				}
			});
		});
	},

	stackDeploy: function(projectName) {
		return new Promise((resolve, reject) => {
			command = "docker stack deploy -c " + process.cwd() + '/docker-compose.yml ' + projectName
			cmd = 'cd ' + process.cwd() + ' && ' + command;
			logging('exectuing: ', cmd, '...');
			exec(cmd, (error, data) => {
				if (error) {
					reject(error);
				}else {
					logging('exectuing [stack deploy] success');
					resolve(data);
				}
			})
		});
	},

	join: function(command) {
		return new Promise((resolve, reject) => {
			cmd = 'cd ' + process.cwd() + ' && ' + command;
			exec(cmd, (error, data) => {
				if (error) {
					reject(error);
				}else {
					logging('join swarm success');
					resolve(data);
				}
			})
		});
	},

	getJoinCommand: function(data) {
		cmdSplit = data.split('\n\n');
		if(cmdSplit[2]) {
			var joinCommand = cmdSplit[2];
			if(joinCommand.indexOf('docker swarm join --token') > -1) {
				return joinCommand;
			}

			return false;
		}

		return false;
	}
}

module.exports = Swarm;
