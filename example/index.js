const Micro = require('../src');

const routers = {
	'/': {
		afterRoute: function(ctx, next, response) {
			ctx.body = response.body;
		},
		name: 'index',
		alias: 'index',
		method: 'get'
	},

	'/shit/:id': {
		afterRoute: function(ctx, next) {
			ctx.body = 'shit api 0.1, params=' + JSON.stringify(this.params);
		},
		name: 'shit',
		alias: 'shit',
		method: 'get'
	}
}

var micro = new Micro({

	withDocker: false,

	dockerMachine: {

	},

	compose: {
		src: './docker-compose.yml'
	},

	services: [{
		image: 'node',
		name: 'test',
		containerPort: 4567,
		hostPort: 9999,
		host: 'http://localhost',
		src: '/Volumes/fuck',
		cmd: ['node /var/workspace/index.js'],
		router: {
			configs: routers,
			onError: function(ctx, next, error) {
				ctx.body = error;
			}
		}
	}, {
		name: 'tests',
		containerPort: 4567,
		hostPort: 4001
	}]

});

micro.run({
	port: 3001
}, (logging) => {
	logging('example is running on port 3001');
});
