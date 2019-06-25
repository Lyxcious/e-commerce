const Product = require('../models/product');

module.exports = function(done) {
  if (process.env.NODE_ENV === 'test') {
    Product
      .deleteMany({})
      .then(function() {
        console.log('Clear product testing database')
        done();
      })
      .catch(function(err) {
        console.log(err);
      });
  }
};