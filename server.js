const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const passport = require('passport')
const multer = require('multer')
const flash = require('connect-flash')

const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')

const configDB = require('./config/database.js')

// Config ---------------------------------------------------------------------------------------------------------------------------------------------------------------------
mongoose.connect(configDB.url)

require('./config/passport')(passport)

app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser())
app.use(express.static('public'))

app.set('view engine','ejs')

// req for passport ----------------------------------------------------------------------------------------------------------------------------------------------------------
app.use(session({secret: 'ilovecakeyumyumcake'}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// Routes ---------------------------------------------------------------------------------------------------------------------------------------------------------------------
require('./routes/routes.js')(app,passport,multer)

//Launch ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.listen(port)
console.log(`Server is running on port ${port}`)