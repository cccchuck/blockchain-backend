const mysql2 = require('mysql2')
const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = require('../app/config')

const connectionPool = mysql2.createPool({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
})

connectionPool.getConnection((err, con) => {
  if (!err) {
    console.log('Connect Successful')
  } else {
    console.log('Connect Failure')
  }
})

module.exports = connectionPool.promise()
