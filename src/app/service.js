// 连接 mysql，考虑到高并发，采用连接池的方式去提供 mysql 服务
const mysql2 = require('mysql2/promise')
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

module.exports = connectionPool
