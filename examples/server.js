'use strict'

const createHafas = require('hafas-client')
const createApi = require('..')

let port = process.env.PORT || 4000
const profiles = ['bvg', 'cmta', 'db', 'insa', 'nahsh', 'oebb', 'sbahn-muenchen', 'vbb']

for (let p of profiles) {
	const profile = require('hafas-client/p/' + p)
	const hafas = createHafas(profile, 'my-awesome-program')

	const config = {
		hostname: `${process.env.HOSTNAME}/${p}` || `${p}.transport.rest`,
		port: port++,
		name: `${p}-rest`,
		description: `An HTTP API for ${p}`,
		logging: false,
		healthCheck: () => {
			return hafas.station('8011306')
			.then((station) => !!station)
		}
	}

	const api = createApi(hafas, config, () => {})

	api.listen(config.port, (err) => {
		if (err) {
			console.error(err)
			process.exitCode = 1
		} else {
			console.info(`Listening on ${config.hostname}:${config.port}.`)
		}
	})
}

