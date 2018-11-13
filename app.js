'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')
const schedule = require('node-schedule')
const worker = require('./schedule')

module.exports = function (fastify, opts, next) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in services
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({}, opts)
  })

  fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/'
  })

  fastify.register(require('point-of-view'), {
    engine: {
      nunjucks: require('nunjucks')
    }
  })

  if (process.env.NODE_ENV !== 'test') {
    schedule.scheduleJob('0 */2 * * *', () => {
      console.log('worker running……')
      worker(fastify)
    })
  }

  // Make sure to call next when done
  next()
}
