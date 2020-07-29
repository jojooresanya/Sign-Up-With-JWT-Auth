const {
  Router
} = require('express')
const User = require('../models/user')
const {
  signUpValidator,
  loginValidator
} = require('../validation/validation')
const auth = require('../middleware/auth')

const router = new Router()

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.post('/signup', async (req, res) => {
  const {
    name,
    email,
    password,
    password2
  } = req.body

  const errors = signUpValidator(name, email, password, password2)

  if (errors.length > 0) {
    return res.render('signup', {
      errors,
      name,
      email,
      password,
      password2
    })
  }
  try {
    const user = await User.findOne({
      email
    })

    if (user) {
      errors.push({
        msg: 'Email is already registered'
      })

      return res.render('signup', {
        errors,
        name,
        email,
        password,
        password2
      })
    }

    const newUser = new User({
      name,
      email,
      password,
      date: new Date()
    })

    await newUser.save()

    req.flash('success_msg', 'You are now registered and can login')
    res.redirect('/user/login')
  } catch (e) {
    res.status(500).json({
      error: e.message
    })
  }
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', async (req, res) => {
  const {
    email,
    password
  } = req.body

  const errors = loginValidator(email, password)

  if (errors.length > 0) {
    return res.render('signup', {
      errors,
      email,
      password
    })
  }

  try {
    const user = await User.findByCredentials(email, password)
    if (user.error) {
      errors.push(user.error)

      return res.render('login', {
        errors,
        email,
        password
      })
    }

    await user.generateAuthToken()
    res.redirect('/user/dashboard')
  } catch (e) {
    res.status(500).json({
      error: e.message
    })
  }
})

router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
    await req.user.save()
    req.flash('success_msg', 'You logged out successfully')
    res.status(200).redirect('/user/login')
  } catch (e) {
    res.json({
      error: e.message
    })
  }
})

router.get('/dashboard', auth, (req, res) => {
  res.render('dashboard')
})

module.exports = router