let mongoose = require('mongoose')
let bcrypt = require('bcrypt-nodejs')

let UserSchema = mongoose.Schema({

    local: {
        email: String,
        password: String
    },
    facebook: {
        id: String,
        token: String,
        name: String,
        email: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
})

//methods
UserSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null)
}

//check password valid
UserSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.local.password)
}

//create model for users
module.exports = mongoose.model('User',UserSchema)