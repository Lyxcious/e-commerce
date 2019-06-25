const chai = require('chai')
const chaiHttp = require('chai-http')
const clearCart = require('../helpers/delete-cart-test')
const app = require('../app')

chai.use(chaiHttp)
chai.should()

let accessToken, accessTokenNonAdmin
const wrongToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDEwY2MxYzk5YjZlMTRjMWI0MWU0MmEiLCJlbWFpbCI6ImhhaGFAdGVzdC5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.-MY2HYrdbVxhRfQ1EBpLF3Tjw-RKi2UkdKAxt2PKCOI"
const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidXNlciIsIWlsIjoidXNlckB0ZXN0LmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.QrZ5a9QoubRSSltG9e-TFrgG1Bco3Cck7Q_ayk-Fj00"
let idCart
let idProduct1, idProduct2

after(function(done) {
  clearCart(done);
});

describe('Successfull login admin', function () {
  it('Should return an object with status code 200', function (done) {
    chai
      .request(app)
      .post('/user/login')
      .send({
        email: 'admin@admin.com',
        password: '12345678'
      })
      .then(res => {
        res.body.should.be.an('object')
        res.body.should.be.have.property('access_token')
        res.body.should.be.have.property('name')
        res.body.should.be.have.property('email')
        res.body.name.should.equal('admin')
        res.body.email.should.equal('admin@admin.com')
        res.should.have.status(200)
        accessToken = res.body.access_token
        done()
      })
      .catch(err => {
        console.log(err)
      })
  })
})
describe('Successfull login user', function () {
  it('Should return an object with status code 200', function (done) {
    chai
      .request(app)
      .post('/user/login')
      .send({
        email: 'user@test.com',
        password: '12345678'
      })
      .then(res => {
        res.body.should.be.an('object')
        res.body.should.be.have.property('access_token')
        res.body.should.be.have.property('name')
        res.body.should.be.have.property('email')
        res.body.name.should.equal('user')
        res.body.email.should.equal('user@test.com')
        res.should.have.status(200)
        accessTokenNonAdmin = res.body.access_token
        done()
      })
      .catch(err => {
        console.log(err)
      })
  })
})
describe('Successfull create product 1 for cart testing', function () {
  it('Should return an object with status code 201', function (done) {
    chai
      .request(app)
      .post('/product/create')
      .send({
        name: 'Product Test 1',
        desc: 'Product desc testing',
        price: 20000,
        stock: 500
      })
      .set('access_token', `${accessToken}`)
      .then(res => {
        res.body.should.be.an('object')
        res.body.should.be.have.property('_id')
        res.body.should.be.have.property('name')
        res.body.should.be.have.property('desc')
        res.body.should.be.have.property('price')
        res.body.should.be.have.property('stock')
        res.body.name.should.equal('Product Test 1')
        res.body.desc.should.equal('Product desc testing')
        res.body.price.should.equal(20000)
        res.body.stock.should.equal(500)
        res.should.have.status(201)
        idProduct1 = res.body._id
        done()
      })
      .catch(err => {
        console.log(err)
      })
  })
})
describe('Successfull create product 2 for cart testing', function () {
  it('Should return an object with status code 201', function (done) {
    chai
      .request(app)
      .post('/product/create')
      .send({
        name: 'Product Test 2',
        desc: 'Product desc testing',
        price: 20000,
        stock: 5
      })
      .set('access_token', `${accessToken}`)
      .then(res => {
        res.body.should.be.an('object')
        res.body.should.be.have.property('_id')
        res.body.should.be.have.property('name')
        res.body.should.be.have.property('desc')
        res.body.should.be.have.property('price')
        res.body.should.be.have.property('stock')
        res.body.name.should.equal('Product Test 2')
        res.body.desc.should.equal('Product desc testing')
        res.body.price.should.equal(20000)
        res.body.stock.should.equal(5)
        res.should.have.status(201)
        idProduct2 = res.body._id
        done()
      })
      .catch(err => {
        console.log(err)
      })
  })
})
describe('Testing Cart Server Endpoint', function () {
  describe('Test Create Cart Endpoint', function () {
    describe('POST /cart/create', function () {
      describe('Successfull create cart', function () {
        it('Should return an object with status code 201', function (done) {
          chai
            .request(app)
            .post('/cart/create')
            .set('access_token', `${accessTokenNonAdmin}`)
            .then(res => {
              res.body.should.be.an('object')
              res.body.should.be.have.property('_id')
              res.body.should.be.have.property('user')
              res.body.should.be.have.property('products').with.lengthOf(0)
              res.body.should.be.have.property('quantity').with.lengthOf(0)
              res.body.should.be.have.property('statusCheckOut')
              res.body.statusCheckOut.should.equal(false)
              res.should.have.status(201)
              idCart = res.body._id
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail create cart with wrong access token', function () {
        it('Should return an error with status code 404 and message: "User not found!"', function (done) {
          chai
            .request(app)
            .post('/cart/create')
            .set('access_token', `${wrongToken}`)
            .then(res => {
              res.body.message.should.equal('User not found!')
              res.should.have.status(404)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
      describe('Fail create cart with invalid access token', function () {
        it('Should return an error with status code 400 and message: "Invalid Token"', function (done) {
          chai
            .request(app)
            .post('/cart/create')
            .set('access_token', `${invalidToken}`)
            .then(res => {
              res.body.message.should.equal('Invalid Token')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
      describe('Fail create cart without access token', function () {
        it('Should return an error with status code 401 and message: "Please login first!"', function (done) {
          chai
            .request(app)
            .post('/cart/create')
            // .set('access_token', `${accessToken}`)
            .then(res => {
              res.body.message.should.equal('Please login first!')
              res.should.have.status(401)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
      describe('Fail create cart with user that already have an empty cart', function () {
        it('Should return an error with status code 400 and message: "User already have an empty cart"', function (done) {
          chai
            .request(app)
            .post('/cart/create')
            .set('access_token', `${accessTokenNonAdmin}`)
            .then(res => {
              res.body.message.should.equal('User already have an empty cart')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
    })
  })
  describe('Test Read Cart Endpoint', function () {
    describe('GET /cart/detail/', function () {
      describe('Successfull get cart', function () {
        it('Should return an object with status code 200', function (done) {
          chai
            .request(app)
            .get('/cart/detail')
            .set('access_token', `${accessTokenNonAdmin}`)
            .then(res => {
              res.body.should.be.an('object')
              res.body.should.be.have.property('_id')
              res.body.should.be.have.property('user')
              res.body.should.be.have.property('products')
              res.body.should.be.have.property('quantity')
              res.body.should.be.have.property('statusCheckOut')
              res.body.statusCheckOut.should.equal(false)
              res.should.have.status(200)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail get cart with wrong access token', function () {
        it('Should return an error with status code 404 and message: "User not found!"', function (done) {
          chai
            .request(app)
            .get('/cart/detail')
            .set('access_token', `${wrongToken}`)
            .then(res => {
              res.body.message.should.equal('User not found!')
              res.should.have.status(404)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
      describe('Fail get cart with invalid access token', function () {
        it('Should return an error with status code 400 and message: "Invalid Token"', function (done) {
          chai
            .request(app)
            .get('/cart/detail')
            .set('access_token', `${invalidToken}`)
            .then(res => {
              res.body.message.should.equal('Invalid Token')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
      describe('Fail get cart without access token', function () {
        it('Should return an error with status code 401 and message: "Please login first!"', function (done) {
          chai
            .request(app)
            .get('/cart/detail')
            // .set('access_token', `${accessToken}`)
            .then(res => {
              res.body.message.should.equal('Please login first!')
              res.should.have.status(401)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
      describe(`Fail get cart with user that don't have an active cart`, function () {
        it(`Should return an error with status code 404 and message: "User don't have an active cart"`, function (done) {
          chai
            .request(app)
            .get('/cart/detail')
            .set('access_token', `${accessToken}`)
            .then(res => {
              res.body.message.should.equal(`User don't have an active cart`)
              res.should.have.status(404)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
    })
  })
  describe('Test Update Cart Endpoint', function () {
    describe('PATCH /cart/update/:id', function () {
      describe('Successfull update cart', function () {
        it('Should return an object with status code 200', function (done) {
          chai
            .request(app)
            .patch(`/cart/update/${idCart}`)
            .send({
              products: [idProduct1, idProduct2],
              quantity: [4, 5],
            })
            .set('access_token', `${accessTokenNonAdmin}`)
            .then(res => {
              res.body.should.be.an('object')
              res.body.should.be.have.property('_id')
              res.body.should.be.have.property('products')
              res.body.should.be.have.property('quantity')
              res.body.should.be.have.property('statusCheckOut')
              res.body.statusCheckOut.should.equal(false)
              res.should.have.status(200)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail update cart with wrong access token', function () {
        it('Should return an error with status code 404 and message: "User not found!"', function (done) {
          chai
            .request(app)
            .patch(`/cart/update/${idCart}`)
            .send({
              products: [idProduct1, idProduct2],
              quantity: [4, 5],
            })
            .set('access_token', `${wrongToken}`)
            .then(res => {
              res.body.message.should.equal('User not found!')
              res.should.have.status(404)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
      describe('Fail update cart with invalid access token', function () {
        it('Should return an error with status code 400 and message: "Invalid Token"', function (done) {
          chai
            .request(app)
            .patch(`/cart/update/${idCart}`)
            .send({
              products: [idProduct1, idProduct2],
              quantity: [4, 5],
            })
            .set('access_token', `${invalidToken}`)
            .then(res => {
              res.body.message.should.equal('Invalid Token')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
      describe('Fail update cart without access token', function () {
        it('Should return an error with status code 401 and message: "Please login first!"', function (done) {
          chai
            .request(app)
            .patch(`/cart/update/${idCart}`)
            .send({
              products: [idProduct1, idProduct2],
              quantity: [4, 5],
            })
            // .set('access_token', `${accessToken}`)
            .then(res => {
              res.body.message.should.equal('Please login first!')
              res.should.have.status(401)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
      describe('Fail update cart with unauthorized access token', function () {
        it('Should return an error with status code 403 and message: "Unauthorized"', function (done) {
          chai
            .request(app)
            .patch(`/cart/update/${idCart}`)
            .send({
              products: [idProduct1, idProduct2],
              quantity: [4, 5],
            })
            .set('access_token', `${accessToken}`)
            .then(res => {
              res.body.message.should.equal('Unauthorized')
              res.should.have.status(403)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
      describe(`Fail update cart with wrong cart id`, function () {
        it(`Should return an error with status code 404 and message: "Cart not found!"`, function (done) {
          chai
            .request(app)
            .patch(`/cart/update/5d0cebd686ef401a48b134dd`)
            .send({
              products: [idProduct1, idProduct2],
              quantity: [4, 5],
            })
            .set({
              'access_token': accessTokenNonAdmin
            })
            .then(res => {
              res.body.message.should.equal(`Cart not found!`)
              res.should.have.status(404)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
      describe('Fail update cart that have item quantity more than stock', function () {
        it(`Should return an object with status code 400 and message: "Product quantity can't exceeded stock"`, function (done) {
          chai
            .request(app)
            .patch(`/cart/update/${idCart}`)
            .send({
              products: [idProduct1, idProduct2],
              quantity: [4, 10],
            })
            .set('access_token', `${accessTokenNonAdmin}`)
            .then(res => {
              res.body.message.should.equal(`Product quantity can't exceeded stock`)
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
      describe('Fail update cart that have item quantity with negative number', function () {
        it(`Should return an object with status code 400 and message: "Quantity can't be a negative number"`, function (done) {
          chai
            .request(app)
            .patch(`/cart/update/${idCart}`)
            .send({
              products: [idProduct1, idProduct2],
              quantity: [-4, 5],
            })
            .set('access_token', `${accessTokenNonAdmin}`)
            .then(res => {
              res.body.message.should.equal(`Quantity can't be a negative number`)
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
    })
  })
  describe('Test CheckOut Cart Endpoint', function () {
    describe('PATCH /cart/checkout/:id', function () {
      describe('Fail checkout cart with wrong access token', function () {
        it('Should return an error with status code 404 and message: "User not found!"', function (done) {
          chai
            .request(app)
            .patch(`/cart/checkout/${idCart}`)
            .send({
              products: [idProduct1, idProduct2],
              quantity: [4, 5],
              statusCheckOut: true,
              checkOutDate: new Date()
            })
            .set('access_token', `${wrongToken}`)
            .then(res => {
              res.body.message.should.equal('User not found!')
              res.should.have.status(404)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
      describe('Fail checkout cart with invalid access token', function () {
        it('Should return an error with status code 400 and message: "Invalid Token"', function (done) {
          chai
            .request(app)
            .patch(`/cart/checkout/${idCart}`)
            .send({
              products: [idProduct1, idProduct2],
              quantity: [4, 5],
              statusCheckOut: true,
              checkOutDate: new Date()
            })
            .set('access_token', `${invalidToken}`)
            .then(res => {
              res.body.message.should.equal('Invalid Token')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
      describe('Fail checkout cart without access token', function () {
        it('Should return an error with status code 401 and message: "Please login first!"', function (done) {
          chai
            .request(app)
            .patch(`/cart/checkout/${idCart}`)
            .send({
              products: [idProduct1, idProduct2],
              quantity: [4, 5],
              statusCheckOut: true,
              checkOutDate: new Date()
            })
            // .set('access_token', `${accessToken}`)
            .then(res => {
              res.body.message.should.equal('Please login first!')
              res.should.have.status(401)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
      describe('Fail checkout cart with unauthorized access token', function () {
        it('Should return an error with status code 403 and message: "Unauthorized"', function (done) {
          chai
            .request(app)
            .patch(`/cart/checkout/${idCart}`)
            .send({
              products: [idProduct1, idProduct2],
              quantity: [4, 5],
              statusCheckOut: true,
              checkOutDate: new Date()
            })
            .set('access_token', `${accessToken}`)
            .then(res => {
              res.body.message.should.equal('Unauthorized')
              res.should.have.status(403)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
      describe(`Fail checkout cart with wrong cart id`, function () {
        it(`Should return an error with status code 404 and message: "Cart not found!"`, function (done) {
          chai
            .request(app)
            .patch(`/cart/checkout/5d0cebd686ef401a48b134dd`)
            .send({
              products: [idProduct1, idProduct2],
              quantity: [4, 5],
              statusCheckOut: true,
              checkOutDate: new Date()
            })
            .set({
              'access_token': accessTokenNonAdmin
            })
            .then(res => {
              res.body.message.should.equal(`Cart not found!`)
              res.should.have.status(404)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
      describe('Fail checkout cart that have item quantity more than stock', function () {
        it(`Should return an object with status code 400 and message: "Product quantity can't exceeded stock"`, function (done) {
          chai
            .request(app)
            .patch(`/cart/checkout/${idCart}`)
            .send({
              products: [idProduct1, idProduct2],
              quantity: [4, 10],
              statusCheckOut: true,
              checkOutDate: new Date()
            })
            .set('access_token', `${accessTokenNonAdmin}`)
            .then(res => {
              res.body.message.should.equal(`Product quantity can't exceeded stock`)
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
      describe('Fail checkout cart that have item quantity with negative number', function () {
        it(`Should return an object with status code 400 and message: "Quantity can't be a negative number"`, function (done) {
          chai
            .request(app)
            .patch(`/cart/checkout/${idCart}`)
            .send({
              products: [idProduct1, idProduct2],
              quantity: [-4, 5],
              statusCheckOut: true,
              checkOutDate: new Date()
            })
            .set('access_token', `${accessTokenNonAdmin}`)
            .then(res => {
              res.body.message.should.equal(`Quantity can't be a negative number`)
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
      describe('Successfull checkout cart', function () {
        it('Should return an object with status code 200', function (done) {
          chai
            .request(app)
            .patch(`/cart/checkout/${idCart}`)
            .send({
              products: [idProduct1, idProduct2],
              quantity: [4, 3],
            })
            .set('access_token', `${accessTokenNonAdmin}`)
            .then(res => {
              res.body.should.be.an('object')
              res.body.should.be.have.property('_id')
              res.body.should.be.have.property('products')
              res.body.should.be.have.property('quantity')
              res.body.should.be.have.property('statusCheckOut')
              res.body.should.be.have.property('checkOutDate')
              res.body.statusCheckOut.should.equal(true)
              res.should.have.status(200)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail checkout cart that already checkout', function () {
        it('Should return an object with status code 400 and message: "Cart already checkout!"', function (done) {
          chai
            .request(app)
            .patch(`/cart/checkout/${idCart}`)
            .send({
              products: [idProduct1, idProduct2],
              quantity: [4, 5],
              statusCheckOut: true,
              checkOutDate: new Date()
            })
            .set('access_token', `${accessTokenNonAdmin}`)
            .then(res => {
              res.body.message.should.equal('Cart already checkout!')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
    })
  })
})