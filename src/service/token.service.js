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

async function swapToken(
  fromTokenId,
  fromTokenNumber,
  toTokenId,
  toTokenNumber,
  uid,
  pool
) {
  const connection = await connectionPool.getConnection()
  await connection.beginTransaction()

  try {
    // 更新流动性池子
    let statement =
      'UPDATE pool SET fromTokenNumber = ?, toTokenNumber = ? WHERE fromTokenId = ? AND toTokenId = ?'
    let result = await connection.execute(statement, [
      pool.fromTokenNumber - fromTokenNumber,
      pool.toTokenNumber + toTokenNumber,
      fromTokenId,
      toTokenId,
    ])
    if (!result[0].affectedRows) new Error('Update Pool Failure')

    result = await connection.execute(statement, [
      pool.toTokenNumber + toTokenNumber,
      pool.fromTokenNumber - fromTokenNumber,
      toTokenId,
      fromTokenId,
    ])
    if (!result[0].affectedRows) new Error('Update Pool 2 Failure')

    // 更新用户余额
    statement = 'SELECT balance FROM user_balance WHERE uid = ? AND tokenId = ?'
    result = await connection.execute(statement, [uid, fromTokenId])
    if (!result[0][0]) new Error('Select FromTokenBalance Failure')

    let { balance: fromTokenBalance } = result[0][0]
    fromTokenBalance -= fromTokenNumber
    statement =
      'UPDATE user_balance SET balance = ? WHERE uid = ? AND tokenId = ?'
    result = await connection.execute(statement, [
      fromTokenBalance,
      uid,
      fromTokenId,
    ])
    if (!result[0].affectedRows) new Error('Update FromTokenBalance Failure')

    statement = 'SELECT balance FROM user_balance WHERE uid = ? AND tokenId = ?'
    result = await connection.execute(statement, [uid, toTokenId])
    if (!result[0][0]) new Error('Select ToTokenBalance Failure')

    let { balance: toTokenBalance } = result[0][0]
    toTokenBalance += toTokenNumber
    statement =
      'UPDATE user_balance SET balance = ? WHERE uid = ? AND tokenId = ?'
    result = await connection.execute(statement, [
      toTokenBalance,
      uid,
      toTokenId,
    ])
    if (!result[0].affectedRows) new Error('Update ToTokenBalance Failure')

    await connection.commit()
    return true
  } catch (error) {
    await connection.rollback()
    return false
  }
}

async function stake(uid, tokenId, tokenNumber) {
  const connection = await connectionPool.getConnection()
  await connection.beginTransaction()

  try {
    let statement = 'SELECT APY FROM stake WHERE tokenId = ?'
    let result = await connection.execute(statement, [tokenId])
    if (!result[0][0]) new Error('Select APY Failure')
    const { APY } = result[0][0]
    const stakeTime = new Date()

    statement =
      'INSERT INTO user_stake (uid, tokenId, tokenNum, stakeTime, APY) VALUES (?, ?, ?, ?, ?)'
    result = await connection.execute(statement, [
      uid,
      tokenId,
      tokenNumber,
      stakeTime,
      APY,
    ])
    if (!result[0].affectedRows) new Error('Insert Stake Failure')

    statement = 'SELECT balance FROM user_balance WHERE uid = ? AND tokenId = ?'
    result = await connection.execute(statement, [uid, tokenId])
    if (!result[0][0]) new Error('Select Balance Failure')

    let { balance } = result[0][0]
    balance -= tokenNumber
    statement =
      'UPDATE user_balance SET balance = ? WHERE uid = ? AND tokenId = ?'
    result = await connection.execute(statement, [balance, uid, tokenId])
    if (!result[0].affectedRows) new Error('Update Balance Failure')

    await connection.commit()
    return true
  } catch (error) {
    await connection.rollback()
    return false
  }
}

async function unstake(uid, tokenId, tokenNum, stakeId) {
  const connection = await connectionPool.getConnection()
  await connection.beginTransaction()

  try {
    let statement =
      'SELECT balance FROM user_balance WHERE uid = ? AND tokenId = ?'
    let result = await connection.execute(statement, [uid, tokenId])
    if (!result[0][0]) new Error('Select Balance Failure')

    let { balance } = result[0][0]
    balance += tokenNum
    statement =
      'UPDATE user_balance SET balance = ? WHERE uid = ? AND tokenId = ?'
    result = await connection.execute(statement, [balance, uid, tokenId])
    if (!result[0].affectedRows) new Error('Update user_balance Failure')

    statement = 'DELETE FROM user_stake WHERE id = ?'
    result = await connection.execute(statement, [stakeId])
    if (!result[0].affectedRows) new Error('Delete user_stake Failure')

    await connection.commit()
    return true
  } catch (error) {
    await connection.rollback()
    return false
  }
}

async function getStaked(uid) {
  const statement = `
  SELECT
  user_stake.id as stakeId, user_stake.tokenId, token.name as tokenName, token.logo as tokenLogo, user_stake.tokenNum, user_stake.stakeTime
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

async function getStakedById(stakeId) {
  const statement =
    'SELECT id, uid, tokenId, tokenNum, stakeTime, APY FROM user_stake WHERE id = ?'
  const result = await connectionPool.execute(statement, [stakeId])
  return result[0]
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

async function getUserTokenBalanceByID(uid, tokenId) {
  const statement =
    'SELECT balance FROM user_balance WHERE uid = ? AND tokenId = ?'
  const result = await connectionPool.execute(statement, [uid, tokenId])
  return result[0][0]
}

module.exports = {
  stake,
  unstake,
  swapToken,
  getStaked,
  getStakedById,
  getTokenByID,
  getAllToken,
  getTokenPool,
  getUserTokenBalance,
  getUserTokenBalanceByID,
}
