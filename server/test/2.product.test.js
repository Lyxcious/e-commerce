const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const clearProduct = require('../helpers/delete-product-test')

chai.use(chaiHttp)
chai.should()

let accessToken, accessTokenNonAdmin
const wrongToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDEwY2MxYzk5YjZlMTRjMWI0MWU0MmEiLCJlbWFpbCI6ImhhaGFAdGVzdC5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.-MY2HYrdbVxhRfQ1EBpLF3Tjw-RKi2UkdKAxt2PKCOI"
const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidXNlciIsIWlsIjoidXNlckB0ZXN0LmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.QrZ5a9QoubRSSltG9e-TFrgG1Bco3Cck7Q_ayk-Fj00"
let idProduct

after(function(done) {
  clearProduct(done);
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
describe('Testing Product Server Endpoint', function () {
  describe('Test Create Product Endpoint', function () {
    describe('POST /product/create', function () {
      describe('Successfull create product', function () {
        it('Should return an object with status code 201', function (done) {
          chai
            .request(app)
            .post('/product/create')
            .set('access_token', `${accessToken}`)
            .send({
              name: 'Product Test',
              desc: 'Product desc testing',
              price: 20000,
              stock: 500
            })
            .then(res => {
              res.body.should.be.an('object')
              res.body.should.be.have.property('_id')
              res.body.should.be.have.property('name')
              res.body.should.be.have.property('desc')
              res.body.should.be.have.property('price')
              res.body.should.be.have.property('stock')
              res.body.name.should.equal('Product Test')
              res.body.desc.should.equal('Product desc testing')
              res.body.price.should.equal(20000)
              res.body.stock.should.equal(500)
              res.should.have.status(201)
              idProduct = res.body._id
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail create product with no product name', function () {
        it('Should return an error with status code 400 and message: "Product must have a name!"', function (done) {
          chai
            .request(app)
            .post('/product/create')
            .set('access_token', `${accessToken}`)
            .send({
              // name: 'Product Test',
              desc: 'Product desc testing',
              price: 20000,
              stock: 500
            })
            .then(res => {
              res.body.message.should.equal('Product must have a name!')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Successfull create product with no product description', function () {
        it('Should return an object with status code 201', function (done) {
          chai
            .request(app)
            .post('/product/create')
            .set('access_token', `${accessToken}`)
            .send({
              name: 'Product Test 2',
              // desc: 'Product desc testing',
              price: 20000,
              stock: 500
            })
            .then(res => {
              res.body.should.be.an('object')
              res.body.should.be.have.property('_id')
              res.body.should.be.have.property('name')
              res.body.should.be.have.property('desc')
              res.body.should.be.have.property('price')
              res.body.should.be.have.property('stock')
              res.body.name.should.equal('Product Test 2')
              res.body.desc.should.equal('')
              res.body.price.should.equal(20000)
              res.body.stock.should.equal(500)
              res.should.have.status(201)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail create product with no price', function () {
        it('Should return an error with status code 400 and message: "Product must be have a price!"', function (done) {
          chai
            .request(app)
            .post('/product/create')
            .set('access_token', `${accessToken}`)
            .send({
              name: 'Product Test',
              desc: 'Product desc testing',
              // price: 20000,
              stock: 500
            })
            .then(res => {
              res.body.message.should.equal('Product must be have a price!')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail create product with price input a negative number', function () {
        it('Should return an error with status code 400 and message: "Product price must be a positive number!"', function (done) {
          chai
            .request(app)
            .post('/product/create')
            .set('access_token', `${accessToken}`)
            .send({
              name: 'Product Test',
              desc: 'Product desc testing',
              price: -20000,
              stock: 500
            })
            .then(res => {
              res.body.message.should.equal('Product price must be a positive number!')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail create product with price input not number type', function () {
        it('Should return an error with status code 400 and message: "Product price must be a number!"', function (done) {
          chai
            .request(app)
            .post('/product/create')
            .set('access_token', `${accessToken}`)
            .send({
              name: 'Product Test',
              desc: 'Product desc testing',
              price: true,
              stock: 500
            })
            .then(res => {
              res.body.message.should.equal('Product price must be a number!')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Successfull create product with no stock', function () {
        it('Should return an object with status code 201', function (done) {
          chai
            .request(app)
            .post('/product/create')
            .set('access_token', `${accessToken}`)
            .send({
              name: 'Product Test 2',
              desc: 'Product desc testing',
              price: 20000,
              // stock: 500
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
              res.body.stock.should.equal(0)
              res.should.have.status(201)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail create product with stock input a negative number', function () {
        it('Should return an error with status code 400 and message: "Product stock must be a positive number!"', function (done) {
          chai
            .request(app)
            .post('/product/create')
            .set('access_token', `${accessToken}`)
            .send({
              name: 'Product Test',
              desc: 'Product desc testing',
              price: 20000,
              stock: -500
            })
            .then(res => {
              res.body.message.should.equal('Product stock must be a positive number!')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail create product with stock input not number type', function () {
        it('Should return an error with status code 400 and message: "Product stock must be a number!"', function (done) {
          chai
            .request(app)
            .post('/product/create')
            .set('access_token', `${accessToken}`)
            .send({
              name: 'Product Test',
              desc: 'Product desc testing',
              price: 20000,
              stock: true
            })
            .then(res => {
              res.body.message.should.equal('Product stock must be a number!')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail create product without access token', function () {
        it('Should return an error with status code 401 and message: "Please login first!"', function (done) {
          chai
            .request(app)
            .post('/product/create')
            // .set('access_token', `${accessToken}`)
            .send({
              name: 'Product Test',
              desc: 'Product desc testing',
              price: 20000,
              stock: 500
            })
            .then(res => {
              res.body.message.should.equal('Please login first!')
              res.should.have.status(401)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail create product with wrong access token', function () {
        it('Should return an error with status code 404 and message: "User not found!"', function (done) {
          chai
            .request(app)
            .post('/product/create')
            .set('access_token', `${wrongToken}`)
            .send({
              name: 'Product Test',
              desc: 'Product desc testing',
              price: 20000,
              stock: 500
            })
            .then(res => {
              res.body.message.should.equal('User not found!')
              res.should.have.status(404)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail create product with invalid access token', function () {
        it('Should return an error with status code 400 and message: "Invalid Token"', function (done) {
          chai
            .request(app)
            .post('/product/create')
            .set('access_token', `${invalidToken}`)
            .send({
              name: 'Product Test',
              desc: 'Product desc testing',
              price: 20000,
              stock: 500
            })
            .then(res => {
              res.body.message.should.equal('Invalid Token')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail create product with unauthorize access token', function () {
        it('Should return an error with status code 403 and message: "Only admin can access this!"', function (done) {
          chai
            .request(app)
            .post('/product/create')
            .set('access_token', `${accessTokenNonAdmin}`)
            .send({
              name: 'Product Test',
              desc: 'Product desc testing',
              price: 20000,
              stock: 500
            })
            .then(res => {
              res.body.message.should.equal('Only admin can access this!')
              res.should.have.status(403)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
    })
  })
  describe('Test Read Product Endpoint', function () {
    describe('GET /product/list', function () {
      describe('Successfull get product list', function () {
        it('Should return an array with status code 200', function (done) {
          chai
            .request(app)
            .get('/product/list')
            .then(res => {
              res.body.should.be.an('array')
              res.should.have.status(200)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
    })
    describe('GET /product/detail/:id', function () {
      describe('Successfull get product detail', function () {
        it('Should return an object with status code 200', function (done) {
          chai
            .request(app)
            .get(`/product/detail/${idProduct}`)
            .then(res => {
              res.body.should.be.an('object')
              res.body.should.be.have.property('_id')
              res.body.should.be.have.property('name')
              res.body.should.be.have.property('desc')
              res.body.should.be.have.property('price')
              res.body.should.be.have.property('stock')
              res.body.name.should.equal('Product Test')
              res.body.desc.should.equal('Product desc testing')
              res.body.price.should.equal(20000)
              res.body.stock.should.equal(500)
              res.should.have.status(200)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail get product detail with wrong product id', function () {
        it('Should return an error with status code 404 and message: "Product with id 5d0cebd686ef401a48b134dd not found!"', function (done) {
          chai
            .request(app)
            .get(`/product/detail/5d0cebd686ef401a48b134dd`)
            .then(res => {
              res.body.message.should.equal('Product with id 5d0cebd686ef401a48b134dd not found!')
              res.should.have.status(404)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
    })
  })
  describe('Test Update Product Endpoint', function () {
    describe('PATCH /product/update/:id', function () {
      describe('Successfull update product detail', function () {
        it('Should return an object with status code 200', function (done) {
          chai
            .request(app)
            .patch(`/product/update/${idProduct}`)
            .set('access_token', `${accessToken}`)
            .send({
              name: 'Product Test Update',
              desc: 'Product desc testing update',
              price: 200000,
              stock: 50
            })
            .then(res => {
              res.body.should.be.an('object')
              res.body.should.be.have.property('_id')
              res.body.should.be.have.property('name')
              res.body.should.be.have.property('desc')
              res.body.should.be.have.property('price')
              res.body.should.be.have.property('stock')
              res.body.name.should.equal('Product Test Update')
              res.body.desc.should.equal('Product desc testing update')
              res.body.price.should.equal(200000)
              res.body.stock.should.equal(50)
              res.should.have.status(200)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail update product detail with wrong id', function () {
        it('Should return an error with status code 404 and message: "Product with id 5d0cebd686ef101a48b134dd not found!"', function (done) {
          chai
            .request(app)
            .patch(`/product/update/5d0cebd686ef101a48b134dd`)
            .set('access_token', `${accessToken}`)
            .send({
              name: 'Product Test Update',
              desc: 'Product desc testing update',
              price: 200000,
              stock: 50
            })
            .then(res => {
              res.body.message.should.equal('Product with id 5d0cebd686ef101a48b134dd not found!')
              res.should.have.status(404)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail update product detail with updated price input a negative number', function () {
        it('Should return an error with status code 400 and message: "Product price must be a positive number!"', function (done) {
          chai
            .request(app)
            .patch(`/product/update/${idProduct}`)
            .send({
              name: 'Product Test Update',
              desc: 'Product desc testing update',
              price: -200000,
              stock: 50
            })
            .set('access_token', `${accessToken}`)
            .then(res => {
              res.body.message.should.equal('Product price must be a positive number!')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail update product detail with updated price input not number type', function () {
        it('Should return an error with status code 400 and message: "Product price must be a number!"', function (done) {
          chai
            .request(app)
            .patch(`/product/update/${idProduct}`)
            .send({
              name: 'Product Test Update',
              desc: 'Product desc testing update',
              price: true,
              stock: 50
            })
            .set('access_token', `${accessToken}`)
            .then(res => {
              res.body.message.should.equal('Product price must be a number!')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail update product detail with updated stock input a negative number', function () {
        it('Should return an error with status code 400 and message: "Product stock must be a positive number!"', function (done) {
          chai
            .request(app)
            .patch(`/product/update/${idProduct}`)
            .send({
              name: 'Product Test Update',
              desc: 'Product desc testing update',
              price: 200000,
              stock: -50
            })
            .set('access_token', `${accessToken}`)
            .then(res => {
              res.body.message.should.equal('Product stock must be a positive number!')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail update product detail with updated stock input not number type', function () {
        it('Should return an error with status code 400 and message: "Product stock must be a number!"', function (done) {
          chai
            .request(app)
            .patch(`/product/update/${idProduct}`)
            .send({
              name: 'Product Test Update',
              desc: 'Product desc testing update',
              price: 200000,
              stock: true
            })
            .set('access_token', `${accessToken}`)
            .then(res => {
              res.body.message.should.equal('Product stock must be a number!')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail update product without access token', function () {
        it('Should return an error with status code 401 and message: "Please login first!"', function (done) {
          chai
            .request(app)
            .patch(`/product/update/${idProduct}`)
            .send({
              name: 'Product Test Update',
              desc: 'Product desc testing update',
              price: 200000,
              stock: 50
            })
            // .set('access_token', `${accessToken}`)
            .then(res => {
              res.body.message.should.equal('Please login first!')
              res.should.have.status(401)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail update product with wrong access token', function () {
        it('Should return an error with status code 404 and message: "User not found!"', function (done) {
          chai
            .request(app)
            .patch(`/product/update/${idProduct}`)
            .send({
              name: 'Product Test Update',
              desc: 'Product desc testing update',
              price: 200000,
              stock: 50
            })
            .set('access_token', `${wrongToken}`)
            .then(res => {
              res.body.message.should.equal('User not found!')
              res.should.have.status(404)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail update product with invalid access token', function () {
        it('Should return an error with status code 400 and message: "Invalid Token"', function (done) {
          chai
            .request(app)
            .patch(`/product/update/${idProduct}`)
            .send({
              name: 'Product Test Update',
              desc: 'Product desc testing update',
              price: 200000,
              stock: 50
            })
            .set('access_token', `${invalidToken}`)
            .then(res => {
              res.body.message.should.equal('Invalid Token')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail update product with unauthorize access token', function () {
        it('Should return an error with status code 403 and message: "Only admin can access this!"', function (done) {
          chai
            .request(app)
            .patch(`/product/update/${idProduct}`)
            .send({
              name: 'Product Test Update',
              desc: 'Product desc testing update',
              price: 200000,
              stock: 50
            })
            .set('access_token', `${accessTokenNonAdmin}`)
            .then(res => {
              res.body.message.should.equal('Only admin can access this!')
              res.should.have.status(403)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
    })
  })
  describe('Test Delete Product Endpoint', function () {
    describe('DELETE /product/delete/:id', function () {
      describe('Successfull delete product', function () {
        it('Should return an object with status code 200', function (done) {
          chai
            .request(app)
            .delete(`/product/delete/${idProduct}`)
            .set('access_token', `${accessToken}`)
            .then(res => {
              res.body.should.be.an('object')
              res.body.should.be.have.property('deletedCount')
              res.body.deletedCount.should.equal(1)
              res.should.have.status(200)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail delete product with wrong product id', function () {
        it('Should return an error with status code 404 and message: "Product not found!"', function (done) {
          chai
            .request(app)
            .delete(`/product/delete/5d0cebd686ef401a48b134dd`)
            .set('access_token', `${accessToken}`)
            .then(res => {
              res.body.message.should.equal('Product not found!')
              res.should.have.status(404)
              done()
            })
            .catch(err => {
              console.log(err);
            })
        })
      })
      describe('Fail delete product without access token', function () {
        it('Should return an error with status code 401 and message: "Please login first!"', function (done) {
          chai
            .request(app)
            .delete(`/product/delete/${idProduct}`)
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
      describe('Fail delete product with wrong access token', function () {
        it('Should return an error with status code 404 and message: "User not found!"', function (done) {
          chai
            .request(app)
            .delete(`/product/delete/${idProduct}`)
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
      describe('Fail delete product with invalid access token', function () {
        it('Should return an error with status code 400 and message: "Invalid Token"', function (done) {
          chai
            .request(app)
            .delete(`/product/delete/${idProduct}`)
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
      describe('Fail delete product with unauthorize access token', function () {
        it('Should return an error with status code 403 and message: "Only admin can access this!"', function (done) {
          chai
            .request(app)
            .delete(`/product/delete/${idProduct}`)
            .set('access_token', `${accessTokenNonAdmin}`)
            .then(res => {
              res.body.message.should.equal('Only admin can access this!')
              res.should.have.status(403)
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