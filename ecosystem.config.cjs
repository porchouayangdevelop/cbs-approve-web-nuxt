module.exports = {
	apps: [{
		name: 'APB Info',
		port: 5000,
		exec_node: 'cluster',
		instances: 'max',
		script: './.output/server/index.mjs',
		env: {
			NODE_ENV: "development",
		},
		env_production: {
			NODE_ENV: "production",
		}
	}]
}