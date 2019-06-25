const axios = require('axios')

const ax = axios.create({
  baseURL: 'https://localhost:3000',
});

export default ax