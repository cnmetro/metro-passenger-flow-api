'use strict'

const axios = require('axios')
const Database = require('better-sqlite3')
const subDays = require('date-fns/sub_days')
const dateFns = require('date-fns')
const sleep = require('sleep')
const db = new Database('flow.db', {})
const WEIBO_ID = 2612249974
const RE_NUM = /[0-9]+([.]{1}[0-9]+){0,1}/g
const stmt = db.prepare('INSERT INTO gz VALUES (?, ?)')

function getUrl (page) {
  return `https://api.weibo.cn/2/cardlist?gsid=_2A2527DQUDeRxGeRM6lMX8C7KzjyIHXVTuMDcrDV6PUJbkdAKLXnlkWpNU-THDEvhBqRWWLVmDyXuExFDdpJh08qJ&wm=3333_2001&i=b080bb6&b=0&from=108B093010&c=iphone&networktype=wifi&v_p=69&skin=default&v_f=1&s=780abfc8&lang=en_US&sflag=1&ua=iPhone11,8__weibo__8.11.0__iphone__os12.1&ft=1&aid=01AgyGrPEjUi7G_XNaap1PBBcpVWoCbT9eT3fXSyMsH6GmTgU.&uid=2211600650&container_ext=profile_uid%3A2612249974%7Cnettype%3Awifi%7Cshow_topic%3A1%7Cnewhistory%3A0&count=100&luicode=10000198&containerid=100103type%3D401%26q%3D%E6%82%A0%E6%82%A0%E6%8A%A5%E5%AE%A2%E6%B5%81%EF%BC%9A%E6%98%A8%E6%97%A5%E5%9B%9E%E9%A1%BE%26t%3D0&featurecode=10000085&uicode=10000003&fid=100103type%3D401%26q%3D%E6%82%A0%E6%82%A0%E6%8A%A5%E5%AE%A2%E6%B5%81%EF%BC%9A%E6%98%A8%E6%97%A5%E5%9B%9E%E9%A1%BE%26t%3D0&need_head_cards=1&page=${page}&lfid=1076032612249974&moduleID=pagecard&cum=EAB63A56`
}

function request (page) {
  const url = getUrl(page)
  return axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
      'Referer': 'https://m.weibo.cn/beta'
    }
  })
}

let page = 1

;(async () => {
  while (true) {
    let text
    try {
      const { data } = await request(page)
      const cards = data.cards
      if (cards.length === 0) {
        process.exit()
      }

      cards[0].card_group.forEach(card => {
        text = card.mblog.text
        if (card.mblog.user.id === WEIBO_ID && text.indexOf('悠悠报客流：昨日回顾') > -1) {
          const creatdAt = card.mblog.created_at
          const arr = text.match(RE_NUM)
          const subDate = subDays(new Date(creatdAt), 1)
          const num = arr[2]
          stmt.run(dateFns.format(subDate, 'YYYY-MM-DD'), Number(num))
        }
      })
    } catch (e) {
      console.log(e)
    }
    sleep.sleep(2)
    console.log(page)
    page++
  }
})()
