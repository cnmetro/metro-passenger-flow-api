'use strict'

const fp = require('fastify-plugin')

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(function (fastify, opts, next) {
  fastify.decorate('db', function () {
    const db = require('better-sqlite3')('flow.db', {})
    return db
  })
  next()
})
