module.exports.isLoggedIn = (req,res,next) =>{
 // console.log('REQ.USER :' ,req.user)
    if(!req.isAuthenticated())
  {
    //store the url they requesting 
    req.session.returnTo = req.orginalUrl
    req.flash('error','You must need to Sign In')
    return res.redirect('/login')
  }
  next()
}