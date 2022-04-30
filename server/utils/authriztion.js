const kowjwt = require('koa-jwt')
const { SECRET } = require('../config')

module.exports = {
  auth: kowjwt({
    secret: SECRET
  }).unless({
    path: [/^\/api\/login/]
  }),
  authDeal: () => {
    return async (ctx, next) => {
      return next().catch((err) => {
        if (err.status === 401) {
          ctx.status = 401;
          ctx.body = {
            code: 401,
            msg: err.message
          }
        } else {
          throw err;
        }
      })
    }
  }
}