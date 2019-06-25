module.exports = (req, res, next) => {
  console.log(req.decoded)
  if (req.decoded.email == 'admin@admin.com') {
    next()
  } else {
    next({
      code: 403,
      message: 'Only admin can access this!'
    })
  }
}