const mongoose = require('mongoose')

const {
  Schema
} = mongoose
const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  quantity: Array,
  statusCheckOut: Boolean,
  checkOutDate: Date
})
const Cart = mongoose.model('Cart', cartSchema)
module.exports = Cart