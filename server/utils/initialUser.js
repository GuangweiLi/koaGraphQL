const { User } = require('../db')
module.exports = {
  initialUser: async () => {
    let user = await User.find({username: 'admin'})
    if (user.length) {
      return user
    } else {
      console.log('初始化用户admin，密码123456')
      const user = new User({
        username: 'admin',
        age: 18,
        gender: 'male',
        password: '123456'
      })
      return await user.save()
    }
  }
}