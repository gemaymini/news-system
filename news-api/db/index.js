const mysql=require('mysql')
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '040522',
    database: 'mydb',
  })
  module.exports = db