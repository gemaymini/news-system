const mysql=require('mysql2')
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Zrt040522',
    database: 'news_system',
  })
// 可选：每隔一段时间 ping 一下数据库，保持连接活跃
setInterval(() => {
  pool.query('SELECT 1');
}, 10000); // 每 10 秒 ping 一次

  module.exports = db