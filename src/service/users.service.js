const connectionPool = require('../app/service')
const { encryptPassword } = require('../utils/crypto')

async function getAllUsers() {
  const statement = 'SELECT * FROM users'
  const result = await connectionPool.execute(statement)
  return result[0]
}

async function getUserByUsername(username) {
  const statement = 'SELECT * FROM users WHERE username = ?'
  const result = await connectionPool.execute(statement, [username])
  return result[0]
}

async function signUp(username, password, email) {
  password = encryptPassword(password)
  const statement =
    'INSERT INTO users (username, password, email) VALUES (?, ?, ?)'
  const result = await connectionPool.execute(statement, [
    username,
    password,
    email,
  ])
  return result[0]
}

module.exports = { getAllUsers, getUserByUsername, signUp }
