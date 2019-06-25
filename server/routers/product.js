const router = require('express').Router()
const product = require('../controllers/product')
const auth = require('../middlewares/authenticate')
const autho = require('../middlewares/authorization-product')
const gcsMiddlewares = require("../middlewares/google-cloud-storage")

router.get('/list', product.list);
router.get('/detail/:id', product.detail);
router.use(auth)
router.post('/create', autho, gcsMiddlewares.sendUploadToGCS, product.create);
router.patch('/update/:id', autho, gcsMiddlewares.sendUploadToGCS, product.update);
router.delete('/delete/:id', autho, product.delete);

module.exports = router