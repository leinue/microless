module.exports = function(code, message, data) {
	return JSON.stringify({
		code: code,
		message: message,
		data: data || {}
	});
}