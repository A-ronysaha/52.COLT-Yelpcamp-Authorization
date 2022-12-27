let express = require("express");
let router = express.Router();
let User = require('../models/passport')
let catchAsync = require('../Error/catch_Async')
let passport = require('passport')

router.get('/register',(req,res)=>{
    res.render('passport/register')
})
router.post('/register',catchAsync(async(req,res)=>{
    try{
    let {email , username , password} = req.body
    let newUser = await new User({email,username})
    let registerUser = await User.register(newUser,password)
    console.log(registerUser)

    // When the login operation completes, user will be assigned to req.user.
    // Note: passport.authenticate() middleware invokes req.login() automatically. This function is primarily used when users 
    // sign up, during which req.login() can be invoked to automatically log in the newly registered user.

    req.login(registerUser, function(err) {
        if (err) { return next(err); }
        req.flash('success','Successfully Register')
        res.redirect('/campgrounds')
    });
    }catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
}))

router.get('/login',(req,res)=>{
    res.render('passport/login')
})

// In this route, ""__passport.authenticate()__"" is middleware which will authenticate the request. 
// By default, when authentication succeeds, the req.user property is set to the authenticated user, 
// a login session is established, and the next function in the stack is called. This next function is 
// typically application-specific logic which will process the request on behalf of the user

router.post('/login',passport.authenticate('local',{ failureFlash : true ,  failureRedirect: '/login' }),catchAsync((req,res)=>{
    req.flash('success','Successfully Login Into Campgrounds')
    let redirectUrl = req.session.returnTo || '/campgrounds'
    res.redirect(redirectUrl)
}))

router.get('/logout',(req,res,next)=>{
    // res.send('log out')
    //  req.logout()
    // req.flash('success' , 'Sucessfully logout')
    //  res.redirect('/campgrounds')
        req.logout(req.user, err => {
          if(err) return next(err);
          res.redirect("/login");
        });
      
})

module.exports = router