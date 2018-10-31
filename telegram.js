'use  strict'

const axios = require('axios')

module.exports = text => {
  const url = `https://api.telegram.org/bot${
    process.env.BOT_TOKEN
  }/sendMessage?chat_id=${process.env.CHAT_ID}&text=${text}`

  axios.get(url).catch(err => {
    console.log(err)
  })
}
