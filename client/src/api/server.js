const axios = require('axios')

const ax = axios.create({
  baseURL: 'http://lovely-cart-server.lyxcious.xyz'
  // baseURL: 'http://localhost:3000'
})

export default ax
