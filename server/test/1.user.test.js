const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const clearUser = require('../helpers/delete-user-test')

chai.use(chaiHttp)
chai.should()

after(function(done) {
  clearUser(done);
});

describe('Testing User Server Endpoint', function () {
  describe('Test Register User Endpoint', function () {
    describe('POST /user/register', function () {
      describe('Successfull register admin', function () {
        it('Should return an object with status code 201', function (done) {
          chai
            .request(app)
            .post('/user/register')
            .send({
              name: 'admin',
              email: 'admin@admin.com',
              password: '12345678'
            })
            .then(res => {
              res.body.should.be.an('object')
              res.body.should.be.have.property('_id')
              res.body.should.be.have.property('name')
              res.body.should.be.have.property('email')
              res.body.should.be.have.property('password')
              res.body.name.should.equal('admin')
              res.body.email.should.equal('admin@admin.com')
              res.body.password.should.not.equal('12345678')
              res.should.have.status(201)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Successfull register user', function () {
        it('Should return an object with status code 201', function (done) {
          chai
            .request(app)
            .post('/user/register')
            .send({
              name: 'user',
              email: 'user@test.com',
              password: '12345678'
            })
            .then(res => {
              res.body.should.be.an('object')
              res.body.should.be.have.property('_id')
              res.body.should.be.have.property('name')
              res.body.should.be.have.property('email')
              res.body.should.be.have.property('password')
              res.body.name.should.equal('user')
              res.body.email.should.equal('user@test.com')
              res.body.password.should.not.equal('12345678')
              res.should.have.status(201)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail registering with invalid email format', function () {
        it('Should return an error validation with status code 400 and message: "test@com is not a valid email!"', function (done) {
          chai
            .request(app)
            .post('/user/register')
            .send({
              name: 'user',
              email: 'test@com',
              password: '12345678'
            })
            .then(res => {
              res.body.message.should.equal('test@com is not a valid email!')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail registering with registered email', function () {
        it('Should return an error validation with status code 400 and message: "user@test.com has been registered!"', function (done) {
          chai
            .request(app)
            .post('/user/register')
            .send({
              name: 'user',
              email: 'user@test.com',
              password: '12345678'
            })
            .then(res => {
              res.body.message.should.equal('user@test.com has been registered!')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail registering with password less than 8 character', function () {
        it('Should return an error validation with status code 400 and message: "Password must be more or equal than 8 character!"', function (done) {
          chai
            .request(app)
            .post('/user/register')
            .send({
              name: 'Test',
              email: 'test@test.com',
              password: '1234567'
            })
            .then(res => {
              res.body.message.should.equal('Password must be more or equal than 8 character!')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
    })
  })
  describe('Test Login User Endpoint', function () {
    describe('POST /user/login', function () {
      describe('Successfull login', function () {
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
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail login with wrong email', function () {
        it('Should return an error with status code 400 and message: "Wrong email/password"', function (done) {
          chai
            .request(app)
            .post('/user/login')
            .send({
              email: 'admin@admin.co',
              password: '12345678'
            })
            .then(res => {
              res.body.message.should.equal('Wrong email/password')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
      describe('Fail login with wrong password', function () {
        it('Should return an error with status code 400 and message: "Wrong email/password"', function (done) {
          chai
            .request(app)
            .post('/user/login')
            .send({
              email: 'admin@admin.com',
              password: '123456789'
            })
            .then(res => {
              res.body.message.should.equal('Wrong email/password')
              res.should.have.status(400)
              done()
            })
            .catch(err => {
              console.log(err)
            })
        })
      })
    })
  })
})