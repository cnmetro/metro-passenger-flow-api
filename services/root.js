'use strict'
const isWithinRange = require('date-fns/is_within_range')
const isValid = require('date-fns/is_valid')
const format = require('date-fns/format')

module.exports = async (fastify, opts) => {
  const db = fastify.db()

  fastify.get('/flows', async (request, reply) => {
    const { sort, year, from, to, count } = request.query
    const stmt = db.prepare('SELECT * FROM flow ORDER BY date DESC')
    let data = stmt.all()

    if (from || to) {
      data = data.filter(v => isWithinRange(new Date(v.date), new Date(from), new Date(to || new Date())))
    }

    if (year) {
      data = data.filter(v => Number(v.date.split('-')[0]) === Number(year))
    }

    if (sort && sort.toLowerCase() === 'asc') {
      data = data.sort((a, b) => a.num - b.num)
    } else if (sort && sort.toLowerCase() === 'desc') {
      data = data.sort((a, b) => b.num - a.num)
    }

    if (count) {
      data.length = count
    }

    return {
      data
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
