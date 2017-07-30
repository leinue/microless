
const logging = function() {

	var args = [];

	args.push('[' + Date() + ']: ');
	for (var i = 0; i < arguments.length; i++) {
		var arg = arguments[i];
		args.push(arg);		
	};

	console.log.apply(this, args);
}

module.exports = logging
