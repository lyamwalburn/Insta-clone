const Post = require('../models/Post')

module.exports = function (app, passport,multer) {


    //Image Upload
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'public/images/uploads')
        },
        filename: (req, file, cb) => {
          cb(null, file.fieldname + '-' + Date.now() + ".png")
        }
    });
    const upload = multer({storage: storage});

    //Homepage with login links
    app.get('/', (req, res) => {
        res.render('index.ejs')
    })

    //Login
    app.get('/login', (req, res) => {
        res.render('login.ejs', { message: req.flash('loginMessage') })
    })
    //process login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }))

    //Signup
    app.get('/signup', (req, res) => {
        res.render('signup.ejs', { message: req.flash('signupMessage') })
    })
    //process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }))

    //Profile
    app.get('/profile', isLoggedIn, async (req, res) => {
        let userId = req.session.passport.user
        try{
            const result = await Post.find({'posterId' : userId})
            res.render('profile.ejs', { user: req.user, posts: result })       
        }catch (err){
            console.error(err)
        }
    })

    //Feed
    app.get('/feed',isLoggedIn,(req,res)=>{
        //get all the posts and send them to this page to be displayed
        res.render('feed.ejs', {user: req.user})
    })

    //Individual Post
    app.get('/post/:id', async (req,res)=>{
        let postId = req.params.id
        //find the post in db via id
        try {
            await Post.find({_id: postId}).toArray((err,result)=>{
                if(err) return console.error(err)

                res.render('post.ejs',{posts: result})
            })
        }catch (err){
            console.error(err)
        }
    })

    //Create Post
    app.post('/icPost',upload.single('file-to-upload'),async (req,res,next)=>{
        let userId = req.session.passport.user
        console.log(req.file.filename);
        try{
            await Post.create({
                posterId: userId, 
                title: req.body.title, 
                likes: 0, 
                imgPath: 'images/uploads/' + req.file.filename
            })
            console.log('saved to db')
            res.redirect('/profile')
        } catch (err){
            console.error(err)
        }
    })

    //Logout
    app.get('/logout', (req, res) => {
        req.logout()
        res.redirect('/')
    })

}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next()

    res.redirect('/')
}