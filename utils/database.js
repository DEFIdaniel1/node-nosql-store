require('dotenv').config()
const MySqlPassword = process.env.MY_SQL_PASSWORD
// const mysql = require('mysql2')
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-Udemy',
//     password: MySqlPassword,
// })
// module.exports = pool.promise()

const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('node-Udemy', 'root', MySqlPassword, {
    dialect: 'mysql',
    host: 'localhost',
})
module.exports = sequelize
