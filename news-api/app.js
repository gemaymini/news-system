const express = require('express')
const app = express()
const port = 8080

// 解析请求体
app.use(express.urlencoded({ extended: false })) 
app.use(express.json())

// 允许跨域
const cors = require('cors')
app.use(cors())

// 设置图片上传路径
app.use('/uploads', express.static('./uploads'))

// 托管静态文件
//app.use(express.static('build'))

// 自定义msg中间件
const {okmw, errmw} = require('./utils/msg')
app.use(okmw)
app.use(errmw)

// 解析token
const config = require('./config')
const { expressjwt: jwt } = require('express-jwt')
app.use(
  jwt({
    secret: config.jwtSecretKey,
    algorithms: ["HS256"],
  }).unless({ path: [/^\/admin\/|^\/uploads\//] })
)

// 路由
const admin = require('./router/admin')
const user = require('./router/user')
const power = require('./router/power')
const news = require('./router/news')
app.use(admin)
app.use('/api', user)
app.use('/api', power)
app.use('/api', news)

// 将所有的路由都指向index.html（前端单页应用）
//app.get('*', (req, res) => {
//res.sendFile(__dirname + '/build/index.html')
//})
// 错误全局拦截
const Joi = require('joi')
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') return res.err('身份认证失败！')
  if (err instanceof Joi.ValidationError) return res.err(err)
  res.err(err)
})

app.listen(port, () => {
  console.log(`服务器运行在http://localhost:${port}`)
})
