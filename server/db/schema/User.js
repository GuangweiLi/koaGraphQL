const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: String,
  age: Number,
  gender: String,
  password: String,
  phone: String,
  mail: String
})

module.exports = userSchema