const validator = require('validator')

const signUpValidator = (name, email, password, password2) => {
  const errors = []

  if (!name || !email || !password || !password2) {
    errors.push({
      msg: 'Please fill in all fields'
    })
  }

  if (password !== password2) {
    errors.push({
      msg: 'Passwords don\'t match'
    })
  }

  if (!validator.isEmail(email)) {
    errors.push({
      msg: 'Please provide a valid email'
    })
  }

  if (password.length < 7) {
    errors.push({
      msg: 'Password must be more than 6 characters'
    })
  }

  return errors
}

const loginValidator = (email, password) => {
  const errors = []

  if (!validator.isEmail(email)) {
    errors.push({
      msg: 'Please provide a valid email'
    })
  }

  return errors
}

module.exports = {
  signUpValidator,
  loginValidator
}
