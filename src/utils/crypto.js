const bcryptjs = require('bcryptjs')

const salt = bcryptjs.genSaltSync(10)

function encryptPassword(password) {
  return bcryptjs.hashSync(password, salt)
}

function comparePassword(password, hash) {
  return bcryptjs.compareSync(password, hash)
}

module.exports = { encryptPassword, comparePassword }
