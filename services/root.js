'use strict'
const isValid = require('date-fns/is_valid')
const format = require('date-fns/format')

module.exports = async (fastify, opts) => {
  const cityArray = ['sh', 'bj', 'gz']
  const cityNameObj = {
    bj: '北京',
    sh: '上海',
    gz: '广州'
  }
  const db = fastify.db()

  fastify.get('/api/flows', async (request, reply) => {
    let { sort, year, from, to, count, city } = request.query

    if (cityArray.indexOf(city) === -1) {
      return reply.code(400).send({ message: 'city required' })
    }

    let sql = `SELECT * FROM ${city}`

    if (from || to) {
      from = from || '2016-04-30'
      to = to || format(new Date(), 'YYYY-MM-DD')
      sql += ` WHERE date >= '${from}' and date <= '${to}'`
    }

    if (year) {
      if (from || to) {
        sql += ` AND strftime('%Y', date) = '${year}'`
      } else {
        sql += ` WHERE strftime('%Y', date) = '${year}'`
      }
    }

    if (sort && sort.toLowerCase() === 'asc') {
      sql += ` ORDER BY num ASC`
    } else if (sort && sort.toLowerCase() === 'desc') {
      sql += ` ORDER BY num DESC`
    } else {
      sql += ' ORDER BY date DESC'
    }

    if (count) {
      sql += ` LIMIT ${count}`
    }

    const stmt = db.prepare(sql)

    return {
      data: stmt.all()
    }
  })

  fastify.post('/api/flows', async (request, reply) => {
    const { date, num, key, city } = request.body

    if (cityArray.indexOf(city) === -1) {
      return reply.code(400).send({ message: 'city required' })
    }

    if (key !== process.env.SECRET_KEY) {
      return reply.code(403).send({ message: 'Forbidden' })
    }

    if (!isValid(new Date(date))) {
      return reply.code(400).send({ message: 'date is invalid' })
    }

    if (typeof num !== 'number') {
      return reply.code(400).send({ message: 'num type must be Number' })
    }

    const formatedDate = format(new Date(date), 'YYYY-MM-DD')
    const stmt = db.prepare(`INSERT INTO ${city} VALUES (?, ?)`)
    stmt.run(formatedDate, Number(num))

    return {
      data: { formatedDate, num }
    }
  })

  fastify.get('/:city', async (request, reply) => {
    const { city } = request.params

    if (cityArray.indexOf(city) === -1) {
      return reply.redirect('/public/index.html')
    }

    reply.view('/templates/index.html', {
      city,
      name: cityNameObj[city]
    })
  })
}
