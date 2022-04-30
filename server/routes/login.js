const Router = require('@koa/router')
const jsonwebtoken = require('jsonwebtoken')
const { SECRET } = require('../config')
const { User } = require('../db')

const router = new Router()

router.get('/', async (ctx) => {
  ctx.body = 'hello world'
})

router.post('/api/login', async(ctx) => {
  let checkUser = await User.find({username: ctx.request.body.username, password: ctx.request.body.password})
  if (checkUser.length) {
    ctx.body = {
      code: 200,
      msg: "登录成功",
      token: jsonwebtoken.sign({username: checkUser[0].username, password: checkUser[0].password}, SECRET, {expiresIn: '1h'})
    }
  } else {
    ctx.body = {
      code: 400,
      msg: '用户名密码错误'
    }
  }
})

module.exports = router