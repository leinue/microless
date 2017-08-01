const exec = require('child_process').exec;

var Compose = function() {}

Compose.prototype = {

	up: function() {

		return new Promise(function(resolve, reject) {
			exec('docker-compose up -d' + dir, function(error, data) {
				if (error) reject(error);
				resolve(data);
			});
		});

	}

}

module.exports = Compose;
