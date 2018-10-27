'use strict'
const isValid = require('date-fns/is_valid')
const format = require('date-fns/format')

module.exports = async (fastify, opts) => {
  const db = fastify.db()

  fastify.get('/flows', async (request, reply) => {
    let { sort, year, from, to, count } = request.query
    let sql = `SELECT * FROM flow`

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

  fastify.post('/flows', async (request, reply) => {
    const { date, num } = request.body

    if (!isValid(new Date(date))) {
      return reply.code(400).send({ message: 'date is invalid' })
    }

    if (typeof num !== 'number') {
      return reply.code(400).send({ message: 'num type must be Number' })
    }

    const formatedDate = format(new Date(date), 'YYYY-MM-DD')
    const stmt = db.prepare('INSERT INTO flow VALUES (?, ?)')
    stmt.run(formatedDate, Number(num))

    return {
      data: { formatedDate, num }
    }
  })
}
