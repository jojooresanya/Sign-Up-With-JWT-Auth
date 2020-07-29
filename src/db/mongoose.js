const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/login-with-jwt-auth-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
  .then(res => console.log('connected to db...'))
  .catch(err => console.log(err))
