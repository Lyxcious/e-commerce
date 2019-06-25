const router = require('express').Router()
const product = require('../controllers/product')
const auth = require('../middlewares/authenticate')
const autho = require('../middlewares/authorization-product')

router.get('/list', product.list);
router.get('/detail/:id', product.detail);
router.use(auth)
router.post('/create', autho, product.create);
router.patch('/update/:id', autho, product.update);
router.delete('/delete/:id', autho, product.delete);

module.exports = router