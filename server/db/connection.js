const mongoose = require('mongoose')

let connection = null

const initialize = async () => {
  if (!connection) {
    connection = await mongoose.connect('mongodb://localhost:27017/test_db')
  }
}

initialize()