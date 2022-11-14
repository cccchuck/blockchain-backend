const connectionPool = require('../app/service')

async function getAllToken() {
  const statement = 'SELECT id, name, logo FROM token'
  const result = await connectionPool.execute(statement)
  return result[0]
}

async function getTokenByID(id) {
  const statement = 'SELECT * FROM token WHERE id = ?'
  const result = await connectionPool.execute(statement, [id])
  return result[0][0]
}

async function getTokenPool(fromTokenId, toTokenId) {
  const statement =
    'SELECT fromTokenNumber, toTokenNumber FROM pool WHERE fromTokenId = ? AND toTokenId = ?'
  const result = await connectionPool.execute(statement, [
    fromTokenId,
    toTokenId,
  ])
  return result[0][0]
}

async function getUserTokenBalance(uid) {
  const statement = `
    SELECT
    tmp.uid, tmp.tokenId, tmp.balance, tmp.tokenName, tmp.tokenLogo, pool.fromTokenNumber, pool.toTokenNumber
    FROM
    (SELECT 
    user_balance.uid, user_balance.tokenId, user_balance.balance, token.name as tokenName, token.logo as tokenLogo
    FROM 
    user_balance
    LEFT JOIN
    token
    ON user_balance.tokenId = token.id) as tmp
    LEFT JOIN
    pool
    ON tmp.tokenId = pool.fromTokenId
    WHERE pool.toTokenId = 3 AND tmp.uid = ?`
  const result = await connectionPool.execute(statement, [uid])
  return result[0]
}

async function getStaked(uid) {
  const statement = `
  SELECT
  user_stake.tokenId, token.name as tokenName, token.logo as tokenLogo, user_stake.tokenNum, user_stake.stakeTime
  FROM
  user_stake
  LEFT JOIN
  token
  ON
  user_stake.tokenId = token.id
  WHERE
  user_stake.uid = ?`
  const result = await connectionPool.execute(statement, [uid])
  return result[0]
}

async function getUserTokenBalanceByID(uid, tokenId) {
  const statement =
    'SELECT balance FROM user_balance WHERE uid = ? AND tokenId = ?'
  const result = await connectionPool.execute(statement, [uid, tokenId])
  return result[0][0]
}

async function swapToken(
  fromTokenId,
  fromTokenNumber,
  toTokenId,
  toTokenNumber,
  uid,
  pool,
) {
  // 更新流动性池子
  let statement =
    'UPDATE pool SET fromTokenNumber = ?, toTokenNumber = ? WHERE fromTokenId = ? AND toTokenId = ?'
  let result = await connectionPool.execute(statement, [
    pool.fromTokenNumber - fromTokenNumber,
    pool.toTokenNumber + toTokenNumber,
    fromTokenId,
    toTokenId,
  ])
  if (!result[0].affectedRows) return false

  result = await connectionPool.execute(statement, [
    pool.toTokenNumber + toTokenNumber,
    pool.fromTokenNumber - fromTokenNumber,
    toTokenId,
    fromTokenId,
  ])
  if (!result[0].affectedRows) return false

  // 更新用户余额
  statement =
    'SELECT balance FROM user_balance WHERE uid = ? AND (tokenId = ? or tokenId = ?)'
  result = await connectionPool.execute(statement, [
    uid,
    fromTokenId,
    toTokenId,
  ])
  if (!result[0][0]) return false
  let { balance: fromTokenBalance } = result[0][0]
  let { balance: toTokenBalance } = result[0][1]
  fromTokenBalance -= fromTokenNumber
  toTokenBalance += toTokenNumber

  statement =
    'UPDATE user_balance SET balance = ? WHERE uid = ? AND tokenId = ?'
  result = await connectionPool.execute(statement, [
    fromTokenBalance,
    uid,
    fromTokenId,
  ])
  if (!result[0].affectedRows) return false
  result = await connectionPool.execute(statement, [
    toTokenBalance,
    uid,
    toTokenId,
  ])
  if (!result[0].affectedRows) return false

  return true
}

module.exports = {
  getTokenByID,
  getAllToken,
  getTokenPool,
  getUserTokenBalance,
  getUserTokenBalanceByID,
  swapToken,
  getStaked,
}
