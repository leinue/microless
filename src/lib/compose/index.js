const exec = require('child_process').exec;

var Compose = function() {}

Compose.prototype = {

	up: function(yaml) {
		return new Promise(function(resolve, reject) {
			exec('cd ' + process.cwd() + ' && docker-compose up -d', function(error, data) {
				if (error) reject(error);
				resolve(data);
			});
		});

	}

}

module.exports = Compose;
