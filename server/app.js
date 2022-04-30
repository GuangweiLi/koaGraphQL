const Koa = require('koa')
const app = new Koa()
const koaBody = require('koa-body')
const { auth, authDeal } = require('./utils/authriztion')
const { initialUser } = require('./utils/initialUser')
const { ApolloServer, gql } = require('apollo-server-koa')
const addRoutes = require('./routes')
const { defs, resolvers } = require('./db')
const cors = require('koa-cors')

app.use(cors())
app.use(koaBody())

// 鉴权模块
// app.use(authDeal())
// app.use(auth)

// 初始化用户
initialUser()

// 日志模块
const logger = require('./logger/logger')
app.use(logger())
app.use(async (ctx, next) => {
  const start = new Date();
  let ms = new Date() - start;
  await next();
  try {
    // 开始进入到下一个中间件
    if (ctx.status === 404) {
      ctx.throw(404);
    }
    ms = new Date() - start;
    // 记录响应日志
    ctx.logger.logResponse(ctx, ms);
  } catch (error) {
    ms = new Date() - start;
    // 记录异常日志
    ctx.logger.logError(ctx, error, ms);
  }
});

const initialRoutes = async () => {
  const routes = await addRoutes()
  for (const key in routes) {
    app.use(routes[key].routes())
  }
}

initialRoutes()

async function startApploServer() {
  const typeDefs = gql`
    ${defs}
  `;

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start()
  server.applyMiddleware({ app });

  app.listen({ port: 3000 }, () => {
    console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
  })
}

startApploServer()
