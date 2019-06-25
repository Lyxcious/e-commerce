const router = require('express').Router()
const cart = require('../controllers/cart')
const auth = require('../middlewares/authenticate')
const autho = require('../middlewares/authorization-cart')

router.use(auth)
router.post('/create', cart.create);
router.get('/detail', cart.detail);
router.patch('/update/:id', autho, cart.update);
router.patch('/checkout/:id', autho, cart.checkout)

module.exports = router