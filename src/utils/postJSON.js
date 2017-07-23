module.exports = function(ctx) {
	return function(code, message, data) {
		ctx.body = JSON.stringify({
			code: code,
			message: message,
			data: data || {}
		});
	}
}