const Cart = require('../models/cart')
const Product = require('../models/product')
var mongoose = require('mongoose');

class CartCont {
  static create(req, res, next) {
    let newCart = {
      user: req.decoded._id,
      products: [],
      quantity: [],
      statusCheckOut: false
    }
    Cart.findOne({user: newCart.user, statusCheckOut: false})
      .then(cart => {
        if (cart){
          next({code: 400, message: 'User already have an empty cart'})
        } else {
          return Cart.create(newCart)
        }
      })
      .then(cart => {
        res.status(201).json(cart)
      })
      .catch(next)
  }

  static detail(req, res, next) {
    Cart.findOne({user: req.decoded._id, statusCheckOut: false})
      .populate({
        path: 'user',
        select: ['name', 'email']
      })
      .populate({path: 'products'})
      .exec(function (err, cart) {
        if (err) {
          next({
            code: 500,
            message: err.message
          })
        } else {
          if (cart) {
            res.status(200).json(cart)
          } else {
            next({
              code: 404,
              message: `User don't have an active cart`
            })
          }
        }
      })
  }

  static update(req, res, next) {
    Cart.findById(req.params.id)
    .populate({
      path: 'user',
      select: ['name', 'email']
    })
    .populate({path: 'products'})
    .exec((err, cart) => {
      if (err) {
        next({
          code: 500,
          message: err.message
        })
      } else {
        if (cart) {
          cart.products = req.body.products
          cart.quantity = req.body.quantity
          let promises = []
          for (let i = 0; i < cart.products.length; i++){
            promises.push(Product.findById(cart.products[i]))
          }
          let products_detail = []
          Promise.all(promises)
          .then(productsDetail => {
            for (let i = 0; i < productsDetail.length; i++){
              products_detail.push(productsDetail[i])
            }
            let found = false
            for (let i = 0; i < cart.quantity.length; i++){
              if (cart.quantity[i] > products_detail[i].stock) {
                found = true
              }
            }
            if (found) {
              throw next ({code: 400, message: `Product quantity can't exceeded stock`})
            } else {
              let foundNegative = false
              for (let j in cart.quantity){
                if (cart.quantity[j] < 0){
                  foundNegative = true
                }
              }
              if (foundNegative) {
                throw next ({code: 400, message: `Quantity can't be a negative number`})
              } else {
                return cart.save()
              }
            }
          })
          .then(cart => {
            res.status(200).json(cart)
          })
          .catch(next)
        } else {
          next({
            code: 404,
            message: `Cart with id ${req.params.id} not found!`
          })
        }
      }
    })
  }

  static checkout(req, res, next) {
    let checkoutCart
    Cart.findById(req.params.id)
    .populate({
      path: 'user',
      select: ['name', 'email']
    })
    .populate({path: 'products'})
    .exec((err, cart) => {
      if (err) {
        next({code: 500, message: err.message})
      } else {
        if (cart) {
          if (cart.statusCheckOut) {
            next({code: 400, message: 'Cart already checkout!'})
          } else {
            cart.products = req.body.products
            cart.quantity = req.body.quantity
            let promises = []
            for (let i = 0; i < cart.products.length; i++){
              promises.push(Product.findById(cart.products[i]))
            }
            Promise.all(promises)
            .then(productsDetail => {
              let found = false
              for (let i = 0; i < cart.quantity.length; i++){
                if (cart.quantity[i] > productsDetail[i].stock) {
                  found = true
                }
              }
              if (found) {
                throw next ({code: 400, message: `Product quantity can't exceeded stock`})
              } else {
                let foundNegative = false
                for (let i = 0; i < cart.quantity.length; i++){
                  if (cart.quantity[i] < 0){
                    foundNegative = true
                  }
                }
                if (foundNegative) {
                  throw next ({code: 400, message: `Quantity can't be a negative number`})
                } else {
                  cart.statusCheckOut = true
                  cart.checkOutDate = new Date()
                  return cart.save()
                } 
              }
            })
            .then(cart => {
              checkoutCart = cart
              let promise = []
              for (let i = 0; i < cart.products.length; i++) {
                promise.push(Product.findById(cart.products[i]))
              }
              return Promise.all(promise)
            })
            .then(data => {
              let promise = []
              for (let i = 0; i < data.length; i++) {
                data[i].stock -= checkoutCart.quantity[i]
                promise.push(data[i].save())
              }
              return Promise.all(promise)
            })
            .then(cart => {
              res.status(200).json(checkoutCart)
            })
            .catch(next) 
          }
        } else {
          next({code: 404, message: `Cart with id ${req.params.id} not found!`})
        }
      }
    })
  }
}

module.exports = CartCont