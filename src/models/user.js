const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = await jwt.sign({
    _id: user._id.toString()
  }, process.env.JWT_SECRET_KEY)
  user.tokens = user.tokens.concat({
    token
  })
  await user.save()
  return token
}

userSchema.statics.findByCredentials = async function (email, password) {
  const error = {
    msg: 'Invalid email or password'
  }

  const user = await User.findOne({
    email
  })

  if (!user) {
    return {
      error
    }
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    return {
      error
    }
  }

  return user
}

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User