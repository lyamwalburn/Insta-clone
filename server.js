let express = require('express')
let app = express()
let port = process.env.PORT || 3000
let mongoose = require('mongoose')
let passport = require('passport')
let flash = require('connect-flash')

let morgan = require('morgan')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let session = require('express-session')

let configDB = require('./config/database.js')

// Config ---------------------------------------------------------------------------------------------------------------------------------------------------------------------
mongoose.connect(configDB.url)

require('./config/passport')(passport)

app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser())

app.set('view engine','ejs')

// req for passport ----------------------------------------------------------------------------------------------------------------------------------------------------------
app.use(session({secret: 'ilovecakeyumyumcake'}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// Routes ---------------------------------------------------------------------------------------------------------------------------------------------------------------------
require('./routes/routes.js')(app,passport)

//Launch ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.listen(port)
console.log(`Server is running on port ${port}`)