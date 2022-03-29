//load 
let LocalStrategy = require('passport-local').Strategy

let User = require('../models/User')

module.exports = function(passport){
    //passport session setup
    //use to serialize user for the session
    passport.serializeUser(function(user,done){
        done(null,user.id)
    })

    //use to deserialize the user
    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user)
        })
    })

    //Local Signup -----------------------------------------------------------------------------------------------------------------------------------------------------------
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req,email,password,done){
        //async
        //user.findOne wont fire unless data is sent back
        process.nextTick(function(){
            //find user whos email is the same asthe forms email
            User.findOne({'local.email' : email}, function(err,user){
                if(err)
                    return done(err)
                //check to see if theres already a user with that email
                if(user){
                    return done(null,false,req.flash('signupMessage','That email is already in use.'))
                } else {
                    //if there is no user with that email create the user
                    let newUser = new User()
                    //set user's local credentials
                    newUser.local.email = email
                    newUser.local.password = newUser.generateHash(password)

                    newUser.save(function(err){
                        if(err)
                            throw err
                        return done(null,newUser)
                    })
                }
            })
        })
    }
    ))

    //Local Login -----------------------------------------------------------------------------------------------------------------------------------------------------------
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req,email,password,done){
        User.findOne({'local.email':email}, function(err,user){
            if(err)
                return done(err)
            if(!user)
                return done(null,false,req.flash('loginMessage','No user found.'))
            if(!user.validPassword(password))
                return done(null,false,req.flash('loginMessage','Wrong Password.'))

            return done(null,user)
        })
    }))

}