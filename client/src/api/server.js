const axios = require('axios')

const ax = axios.create({
  baseURL: 'http://localhost:3000'
})

export default ax
