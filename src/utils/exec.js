
const exec = function(command) {
	return new Promise((resolve, reject) => {
		exec(command, (error, data) => {
			if (error) reject(error);
			resolve(data);					
		});
	});
}

module.exports = exec;
