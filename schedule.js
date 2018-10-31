'use strict'

const subDays = require('date-fns/sub_days')
const format = require('date-fns/format')
const Parser = require('rss-parser')
const parser = new Parser()
const sendMessage = require('./telegram')
const RE_NUM = /[0-9]+([.]{1}[0-9]+){0,1}/g
const RSS_URL = 'https://rsshub.app/weibo/user/1742987497'

module.exports = async f => {
  try {
    const feed = await parser.parseURL(RSS_URL)

    for (let i = 0; i < feed.items.length; i++) {
      const element = feed.items[i]
      if (element.contentSnippet.indexOf('地铁网络客流') > -1) {
        const arr = element.contentSnippet.match(RE_NUM)
        const date = format(subDays(new Date(), 1), 'YYYY-MM-DD')
        const num = arr[2]
        const stmt = f.db().prepare('INSERT INTO flow VALUES (?, ?)')
        stmt.run(date, Number(num))
        sendMessage(`${date}: ${num} 万人次`)
        break
      }
    }
  } catch (err) {
    sendMessage(err.message)
  }
}
