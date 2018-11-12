'use strict'

const subDays = require('date-fns/sub_days')
const format = require('date-fns/format')
const Parser = require('rss-parser')
const parser = new Parser()
const sendMessage = require('./telegram')
const RE_NUM = /[0-9]+([.]{1}[0-9]+){0,1}/g
const RSS_URL = [
  {
    url: 'https://rsshub.app/weibo/user/1742987497',
    id: 1742987497,
    db: 'sh',
    keyword: '地铁网络客流'
  },
  {
    url: 'https://rsshub.app/weibo/user/2778292197',
    id: 2778292197,
    db: 'bj',
    keyword: '昨日客流'
  },
  {
    url: 'https://rsshub.app/weibo/user/2612249974',
    id: 2612249974,
    db: 'gz',
    keyword: '悠悠报客流：昨日回顾'
  }
]

module.exports = async f => {
  RSS_URL.forEach(async item => {
    try {
      const feed = await parser.parseURL(item.url)

      for (let i = 0; i < feed.items.length; i++) {
        const element = feed.items[i]
        if (element.contentSnippet.indexOf(item.keyword) > -1) {
          const arr = element.contentSnippet.match(RE_NUM)
          const date = format(subDays(new Date(), 1), 'YYYY-MM-DD')
          const num = item.id === 2778292197 ? arr[3] : arr[2]
          const stmt = f.db().prepare(`INSERT INTO ${item.db} VALUES (?, ?)`)
          stmt.run(date, Number(num))
          console.log(`${item.db}:${date}:${num}万人次`)
          sendMessage(`${item.db}:${date}:${num}万人次`)
          break
        }
      }
    } catch (err) {
      console.log(err)
      sendMessage(err.message)
    }
  })
}
