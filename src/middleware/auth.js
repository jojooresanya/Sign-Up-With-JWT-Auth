const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '')
    const decoded = await jwt.verify(token, 'mysecretkey')
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token
    })

    if (!user) {
      throw new Error()
    }

    req.user = user
    req.token = token

    next()
  } catch (e) {
    console.log(e.message)
    req.flash('error_msg', 'Please login to view this resource')
    res.status(400).redirect('/user/login')
  }
}

module.exports = auth