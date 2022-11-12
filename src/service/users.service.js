const connectionPool = require('../app/service')

async function getAllUsers() {
  const statement = 'SELECT * FROM users'
  const result = await connectionPool.execute(statement)
  return result[0]
}

async function signUp(username, password, email) {
  const statement =
    'INSERT INTO users (username, password, email) VALUES (?, ?, ?)'
  const result = await connectionPool.execute(statement, [
    username,
    password,
    email,
  ])
  return result[0]
}

module.exports = { getAllUsers, signUp }
