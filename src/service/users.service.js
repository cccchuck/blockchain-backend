const connectionPool = require('../app/service')
const { encryptPassword } = require('../utils/crypto')

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

async function resetPwd(uid, password) {
  password = encryptPassword(password)
  const statement = 'UPDATE users SET password = ? WHERE uid = ?'
  const result = await connectionPool.execute(statement, [password, uid])

  if (result[0].affectedRows) return true
  return false
}

async function updatePwd(uid, password) {
  return await resetPwd(uid, password)
}

async function getUserByUID(uid) {
  const statement = 'SELECT * FROM users WHERE uid = ?'
  const result = await connectionPool.execute(statement, [uid])
  return result[0][0]
}

async function getResetCodeByID(uid) {
  const statement = 'SELECT code, updateTime FROM user_code WHERE uid = ?'
  const result = await connectionPool.execute(statement, [uid])
  return result[0][0]
}

async function setResetCodeByID(uid, code, exist) {
  let statement = 'INSERT INTO user_code (uid, code) VALUES (?, ?)'
  if (exist) {
    statement = 'UPDATE user_code SET code = ? WHERE uid = ?'
    const result = await connectionPool.execute(statement, [code, uid])
    if (result[0].affectedRows) return true
    return false
  } else {
    const result = await connectionPool.execute(statement, [uid, code])
    if (result[0].affectedRows) return true
    return false
  }
}

async function getUserByUsername(username) {
  const statement = 'SELECT * FROM users WHERE username = ?'
  const result = await connectionPool.execute(statement, [username])
  return result[0][0]
}

module.exports = {
  signUp,
  resetPwd,
  updatePwd,
  getUserByUID,
  getResetCodeByID,
  setResetCodeByID,
  getUserByUsername,
}
