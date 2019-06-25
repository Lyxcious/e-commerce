const Cart = require('../models/cart')

module.exports = (req, res, next) => {
  Cart.findOne({
      _id: req.params.id,
    })
    .then(cart => {
      if (cart) {
        if (cart.user.equals(req.decoded._id)) {
          next()
        } else {
          next({
            code: 403,
            message: 'Unauthorized'
          })
        }
      } else
        next({
          code: 404,
          message: 'Cart not found!'
        })
    })
    .catch(next)
}