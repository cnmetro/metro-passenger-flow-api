'use strict'

const { test } = require('tap')
const { build } = require('../helper')
const parse = res => JSON.parse(res.payload).data

test('default', async t => {
  const app = build(t)

  const res = await app.inject({
    url: '/flows'
  })
  t.assert(parse(res).length >= 897)
})

test('from', async t => {
  const app = build(t)

  const res = await app.inject({
    url: '/flows?from=2018-10-23'
  })
  t.assert(parse(res).length >= 3)
})

test('to', async t => {
  const app = build(t)

  const res = await app.inject({
    url: '/flows?to=2016-05-01'
  })
  t.assert(parse(res).length === 2)
})

test('from and to', async t => {
  const app = build(t)

  const res = await app.inject({
    url: '/flows?to=2016-05-05&from=2016-04-30'
  })
  t.assert(parse(res).length === 6)
})

test('from and to and count', async t => {
  const app = build(t)

  const res = await app.inject({
    url: '/flows?to=2016-05-05&from=2016-04-30&count=3'
  })
  t.assert(parse(res).length === 3)
})

test('year', async t => {
  const app = build(t)

  const res = await app.inject({
    url: '/flows?year=2017'
  })
  t.assert(parse(res).length === 360)
})

test('order by num desc', async t => {
  const app = build(t)

  const res = await app.inject({
    url: '/flows?sort=desc'
  })
  t.assert(parse(res).length >= 897)
})

test('order by num asc', async t => {
  const app = build(t)

  const res = await app.inject({
    url: '/flows?order=asc'
  })
  t.assert(parse(res).length >= 897)
})

test('count', async t => {
  const app = build(t)

  const res = await app.inject({
    url: '/flows?count=10'
  })
  t.assert(parse(res).length === 10)
})

test('year and count', async t => {
  const app = build(t)

  const res = await app.inject({
    url: '/flows?year=2017&count=10'
  })
  t.assert(parse(res).length === 10)
})
