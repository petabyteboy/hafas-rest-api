'use strict'

const path = require('path')
const createHafas = require('hafas-client')
const vbbProfile = require('hafas-client/p/vbb')
const serve = require('serve-static')

const createApi = require('..')

const config = {
	hostname: process.env.HOSTNAME || '2.vbb.transport.rest',
	port: process.env.PORT || 3000,
	name: 'vbb-rest',
	description: 'An HTTP API for Berlin & Brandenburg public transport.',
	homepage: 'http://example.org/',
	docsLink: 'http://example.org/docs',
	logging: true,
	aboutPage: true,
	healthCheck: () => {
		return hafas.station('900000100001')
		.then((station) => !!station)
	}
}

const logosDir = path.dirname(require.resolve('vbb-logos/package.json'))

const hafas = createHafas(vbbProfile, 'hafas-rest-api-example')

const api = createApi(hafas, config, (api) => {
	api.use('/logos', serve(logosDir, {index: false}))
})

api.listen(config.port, (err) => {
	if (err) {
		console.error(err)
		process.exitCode = 1
	} else {
		console.info(`Listening on ${config.hostname}:${config.port}.`)
	}
})
