const axios = require('axios')

const ax = axios.create({
  baseURL: 'http://lovely-cart-server.lyxcious.xyz'
})

export default ax
