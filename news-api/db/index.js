const mysql=require('mysql2')
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Zrt040522',
    database: 'news_system',
  })
  module.exports = db