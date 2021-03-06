'use strict'

const {
	parseInteger,
	parseBoolean,
	parseString,
	parseQuery
} = require('../lib/parse')

const err400 = (msg) => {
	const err = new Error(msg)
	err.statusCode = 400
	return err
}

const parsers = {
	fuzzy: parseBoolean,
	results: parseInteger,
	stations: parseBoolean,
	addresses: parseBoolean,
	poi: parseBoolean,
	stationLines: parseBoolean,
	language: parseString
}

const createRoute = (hafas, config) => {
	const locations = (req, res, next) => {
		if (!req.query.query) return next(err400('Missing query.'))

		const opt = parseQuery(parsers, req.query)
		config.addHafasOpts(opt, 'locations', req)

		hafas.locations(req.query.query, opt)
		.then((locations) => {
			res.json(locations)
			next()
		})
		.catch(next)
	}
	return locations
}

module.exports = createRoute
