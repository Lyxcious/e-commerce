const router = require('express').Router()
const productRoutes = require('./product')
const userRoutes = require('./user')
const cartRoutes = require('./cart')

router.use('/user', userRoutes)
router.use('/cart', cartRoutes)
router.use('/product', productRoutes)

module.exports = router