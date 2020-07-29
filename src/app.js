const path = require('path')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
require('./db/mongoose')
const session = require('express-session')
const flash = require('connect-flash')

const port = process.env.PORT
const app = express()

const publicDirectory = path.join(__dirname, '../public')

app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))
app.use(express.static(publicDirectory))
app.use(expressLayouts)
app.use(session({
  secret: '8f21a5facfba0ab464650b7511e9c2af40970e5e56213397f49d0d0199',
  resave: true,
  saveUninitialized: true
}))
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  next()
})
app.set('view engine', 'ejs')
app.use('', require('./routes/index'))
app.use('/user', require('./routes/user'))

app.listen(port, console.log(`server started up on port ${port}, God speed!!!`))