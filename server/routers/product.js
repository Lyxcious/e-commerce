const router = require('express').Router()
const product = require('../controllers/product')
const auth = require('../middlewares/authenticate')
const autho = require('../middlewares/authorization-product')
const gcsMiddlewares = require("../middlewares/google-cloud-storage")
const Multer = require('multer');

const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
  },
});

router.get('/list', product.list);
router.get('/detail/:id', product.detail);
router.use(auth)
router.post('/create', autho, multer.single('image'), gcsMiddlewares.sendUploadToGCS, product.create);
router.patch('/update/:id', autho, multer.single('image'), gcsMiddlewares.sendUploadToGCS, product.update);
router.delete('/delete/:id', autho, product.delete);

module.exports = router