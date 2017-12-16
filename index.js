'use strict'

const express = require('express')
const corser = require('corser')
const compression = require('compression')
const nocache = require('nocache')

const headers = corser.simpleRequestHeaders.concat(['User-Agent', 'X-Identifier'])

const poweredByHeader = (req, res, next) => {
	if (!res.headersSent) {
		res.setHeader('X-Powered-By', config.name + ' ' + config.homepage)
	}
	next()
}

const handleErrors = (err, req, res, next) => {
	if (process.env.NODE_ENV === 'dev') console.error(err)
	if (res.headersSent) return next()

	let msg = err.message, code = null
	if (err.isHafasError) {
		msg = 'VBB error: ' + msg
		code = 502
	}
	res.status(code || 500).json({error: true, msg})
	next()
}

const createApi = (hafas, config) => {
	const api = express()

	api.use(corser.create({requestHeaders: headers})) // CORS
	api.use(compression())
	api.use(poweredByHeader)

	const noCache = nocache()
	// todo

	api.use(handleErrors)

	return api
}

module.exports = createApi
