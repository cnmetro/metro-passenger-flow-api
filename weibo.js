'use strict'

const qs = require('querystring')
const axios = require('axios')

module.exports = status => {
  axios.post('https://api.weibo.com/2/statuses/share.json', qs.stringify({
    access_token: process.env.WEIBO_ACCESS_TOKEN,
    status
  })).catch(err => console.log('weibo: ' + err))
}
