const Product = require('../models/product')
const {
  Storage
} = require('@google-cloud/storage');
var mongoose = require('mongoose');

class ProductCont {
  static create(req, res, next) {
    let newProduct = {
      name: req.body.name,
      desc: req.body.desc,
      price: parseInt(req.body.price),
      stock: parseInt(req.body.stock)
    }
    if (req.file) {
      newProduct.image = req.file.gcsUrl
    } else {
      newProduct.image = req.body.image
    }
    if (!newProduct.name || newProduct.name.length == 0) {
      next({
        code: 400,
        message: 'Product must have a name!'
      })
    } else {
      if (!newProduct.desc) {
        newProduct.desc = ""
      }
      if (!newProduct.price) {
        next({
          code: 400,
          message: 'Product must be have a price!'
        })
      } else if (typeof newProduct.price != 'number') {
        next({
          code: 400,
          message: 'Product price must be a number!'
        })
      } else if (newProduct.price < 0) {
        next({
          code: 400,
          message: 'Product price must be a positive number!'
        })
      } else {
        if (!newProduct.stock) {
          newProduct.stock = 0
        } else if (typeof newProduct.stock != 'number') {
          next({
            code: 400,
            message: 'Product stock must be a number!'
          })
        } else if (newProduct.stock < 0) {
          next({
            code: 400,
            message: 'Product stock must be a positive number!'
          })
        }
        Product.create(newProduct)
          .then(product => {
            res.status(201).json(product)
          })
          .catch(next)
      }
    }
  }

  static list(req, res, next) {
    Product.find({}).exec(function (err, products) {
      if (err) {
        next({
          code: 500,
          message: err.message
        })
      } else {
        if (products) {
          res.status(200).json(products)
        } else {
          res.status(200).json([])
        }
      }
    })
  }

  static detail(req, res, next) {
    Product.findById(req.params.id).exec(function (err, product) {
      if (err) {
        next({
          code: 500,
          message: err.message
        })
      } else {
        if (product) {
          res.status(200).json(product)
        } else {
          next({
            code: 404,
            message: `Product with id ${req.params.id} not found!`
          })
        }
      }
    })
  }

  // static filter(req, res, next) {
  //   let where = {}
  //   if (req.params.field === 'name') {
  //     where['name'] = {
  //       $regex: req.params.value,
  //       $options: 'i'
  //     }
  //   } else {
  //     where[req.params.field] = req.params.value
  //   }
  //   product.find(where).exec(function (err, products) {
  //     if (err) {
  //       next({
  //         code: 500,
  //         message: err.message
  //       })
  //     } else {
  //       if (products) {
  //         res.status(200).json(products)
  //       } else {
  //         res.status(200).json([])
  //       }
  //     }
  //   })
  // }

  static update(req, res, next) {
    Product.findById(req.params.id, (err, product) => {
      if (err) {
        next({
          code: 500,
          message: err.message
        })
      } else {
        if (product) {
          if (typeof parseInt(req.body.price) !== "number") {
            next({
              code: 400,
              message: 'Product price must be a number!'
            })
          } else if (req.body.price < 0) {
            next({
              code: 400,
              message: 'Product price must be a positive number!'
            })
          } else {
            if (typeof parseInt(req.body.stock) !== "number") {
              next({
                code: 400,
                message: 'Product stock must be a number!'
              })
            } else if (req.body.stock < 0) {
              next({
                code: 400,
                message: 'Product stock must be a positive number!'
              })
            } else {
              product.name = req.body.name
              product.desc = req.body.desc
              product.price = parseInt(req.body.price)
              product.stock = parseInt(req.body.stock)
              const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID; // Replace with your project ID
              const GOOGLE_CLOUD_KEYFILE = process.env.GOOGLE_CLOUD_KEYFILE; // Replace with the path to the downloaded private key

              const storage = new Storage({
                projectId: GOOGLE_CLOUD_PROJECT_ID,
                keyFilename: GOOGLE_CLOUD_KEYFILE,
              });

              const bucketName = process.env.DEFAULT_BUCKET_NAME;
              if (req.file) {
                let deleteFile = product.image
                console.log(deleteFile)

                product.image = req.file.gcsUrl
                if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
                  let filename = deleteFile.replace(/(https:\/\/storage.googleapis.com\/my-e-commerce-storage\/)/, '')
                }
                console.log(filename)
                console.log(bucketName)
                storage
                  .bucket(bucketName)
                  .file(filename)
                  .delete();

                console.log(`gs://${bucketName}/${filename} deleted.`);
              }

              let updatedProduct = product
              product.save()
                .then(() => {
                  res.status(200).json(updatedProduct)
                })
                .catch(next)
            }
          }
        } else {
          next({
            code: 404,
            message: `Product with id ${req.params.id} not found!`
          })
        }
      }
    })
  }

  static delete(req, res, next) {
    Product.findById({
        _id: req.params.id
      })
      .then(product => {
        if (product) {
          return Product.deleteOne({
            _id: req.params.id
          })
        } else {
          throw next({
            code: 404,
            message: 'Product not found!'
          })
        }
      })
      .then(result => {
        res.status(200).json(result)
      })
      .catch(next)
  }
}

module.exports = ProductCont