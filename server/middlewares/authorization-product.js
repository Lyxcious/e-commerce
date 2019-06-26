module.exports = (req, res, next) => {
  if (req.decoded.email == 'admin@admin.com') {
    next()
  } else {
    next({
      code: 403,
      message: 'Only admin can access this!'
    })
  }
}