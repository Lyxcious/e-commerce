const User = require('../models/user');

module.exports = function(done) {
  if (process.env.NODE_ENV === 'test') {
    User
      .deleteMany({})
      .then(function() {
        console.log('Clear user testing database')
        done();
      })
      .catch(function(err) {
        console.log(err);
      });
  }
};