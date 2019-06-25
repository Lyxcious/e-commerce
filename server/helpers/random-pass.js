module.exports = () => {
  let kamus = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let pass = ''
  for (let i = 0; i < 8; i++) {
    let index = Math.floor(Math.random() * kamus.length)
    pass += kamus[index]
  }
  return pass
}