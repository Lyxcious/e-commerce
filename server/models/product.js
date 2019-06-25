const mongoose = require('mongoose')

const { Schema } = mongoose
const productSchema = new Schema({
  name: String,
  desc: String,
  price: Number,
  stock: Number
})
const Product = mongoose.model('Product', productSchema)
module.exports = Product