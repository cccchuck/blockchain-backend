// 通过 dotenv 库导入 .env 文件
// 该文件对 .env 统一进行处理，降低耦合度
const dotenv = require('dotenv')

dotenv.config()

const {
  PORT,
  SECRET,
  EMAIL_USER,
  EMAIL_PASS,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env

module.exports = {
  PORT,
  SECRET,
  EMAIL_USER,
  EMAIL_PASS,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
}
