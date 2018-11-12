'use strict'

const Database = require('better-sqlite3')
const db = new Database('flow.db', {})
const stmt = db.prepare('INSERT INTO gz VALUES (?, ?)')

var data = [
  { date: '2015-02-21', num: '322.3' },
  { date: '2015-02-20', num: '300.3' },
  { date: '2015-02-19', num: '300.6' },
  { date: '2015-02-18', num: '250.4' }
]
data.forEach(item => {
  stmt.run(item.date, Number(item.num))
})

/*
var a = [].slice.call(document.querySelectorAll('.WB_feed_detail .WB_detail .WB_text.W_f14')).filter(v => v.innerText.indexOf('昨日客流') > -1).map(v => {
  const arr = v.innerText.match(/[0-9]+([.]{1}[0-9]+){0,1}/g)
  try {
    if (arr[0] < 10) {
      arr[0] = `0${arr[0]}`
    }
    if (arr[1] < 10) {
      arr[1] = `0${arr[1]}`
    }
    return {
      date: `2013-${arr[0]}-${arr[1]}`,
      num: arr[3]
    }
  } catch(e) {}
})

console.log(JSON.stringify(a))
*/
