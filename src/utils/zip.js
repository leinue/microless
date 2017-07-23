var zip = function(dir) {
	return new Promise(function(resolve, reject) {
		dir = dir.split('/');
		var zipFolder = dir.pop();
		dir = dir.join('/');
		exec('cd ' + dir + ' && zip -r ' + zipFolder + '.zip ' + zipFolder, function(error, data) {
			if (error) reject(error);
			resolve(data);
		});
	});
};

module.exports = zip;