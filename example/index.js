const Micro = require('../src')

var micro = new Micro();

micro.run({
	port: 3001
}, () => {
	console.log('[' + Date() + ']: ' + 'example is running on port 3001');
});
