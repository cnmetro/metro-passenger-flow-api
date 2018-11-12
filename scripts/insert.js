'use strict'

const Database = require('better-sqlite3')
const db = new Database('flow.db', {})
const stmt = db.prepare('INSERT INTO bj VALUES (?, ?)')

var data = [
  { date: '2012-06-25', num: '720.93' },
  { date: '2012-06-24', num: '485.3' },
  { date: '2012-06-23', num: '521.88' },
  { date: '2012-06-22', num: '546.26' },
  { date: '2012-06-21', num: '789.29' },
  { date: '2012-06-20', num: '733.97' },
  { date: '2012-06-17', num: '524.60' },
  { date: '2012-06-16', num: '565.76' },
  { date: '2012-06-15', num: '643.40' },
  { date: '2012-06-14', num: '708.20' },
  { date: '2012-06-13', num: '698.61' },
  { date: '2012-06-12', num: '708.35' },
  { date: '2012-06-11', num: '716.99' },
  { date: '2012-06-10', num: '531.79' },
  { date: '2012-06-02', num: '559.65' },
  { date: '2012-05-31', num: '710.78' },
  { date: '2012-05-30', num: '710.81' },
  { date: '2012-05-29', num: '696.07' },
  { date: '2012-05-28', num: '718.87' },
  { date: '2012-05-27', num: '549.25' }
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
