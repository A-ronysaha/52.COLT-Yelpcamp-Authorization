let express = require("express")
let app = express()
let overRide = require('method-override')
let ejsMate =  require('ejs-mate')
let path = require("path");

let Campground = require('./models/campground');
let Review = require('./models/review')
let Joi = require("joi");
let { errorSchema , reviewSchema} = require("./joiSchema.js");
let campRoutes = require('./routes/camp')
let userRoutes = require('./routes/userPass')
let revRoute = require('./routes/rev')

let session = require('express-session')
let flash = require('connect-flash')
let passport = require('passport')
let LocalStrategy = require('passport-local')
let User = require('./models/passport')
let expressError = require('./Error/expres_error')
let catchAsync = require("./Error/catch_Async");




app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine('ejs',ejsMate)

app.use(express.urlencoded({extended:true}))
app.use(overRide('_method'))

let mongoose = require('mongoose')
mongoose
  .connect("mongodb://127.0.0.1:27017/yelpCamp_authorization")
  .then(() => {
    console.log("CONNECTION ESTD !!!");
  })
  .catch((err) => {
    console.log("OH NO ERROR !!!");
    console.log(err);
  });

  let validateForm = (req, res, next) => {
    let { error } = errorSchema.validate(req.body);
    if (error) {
      let msg = error.details.map((el) => el.message).join(",");
      throw new expressError(msg, 400);
    } else {
      next();
    }
  };
  let validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let msg = error.details.map((el) => el.message).join(",");
      throw new expressError(msg, 400);
    } else {
      next();
    }
  };


  let sessionOption = {
    secret : 'notgood',
    resave : false ,
    saveUninitialized : true
  }
  
app.use(session(sessionOption))
app.use(flash())

app.use((req,res,next)=>{
  //console.log(req.session)
 res.locals.currentUser = req.user
  res.locals.show = req.flash('success')
  res.locals.err = req.flash('error')
  next()
})

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



// app.get('/fakeuser',async(req,res)=>{
//   let anotherUser = new User({email: 'rony2@gmail.com' , username: 'R_ony'})
//   let brandUser = await User.register(anotherUser , '1419')
//   res.send(brandUser)
// })


app.get('/',(req,res)=>{
      res.render('home')
  })
  
app.use('/campgrounds',campRoutes)
app.use('/',userRoutes)
app.use('/campgrounds/:id/reviews',revRoute)





// this path is only run when anyone of above path

app.all('*',(req,res,next)=>{
  next(new expressError('Page not Found',404))
})

// is dose not match

app.use((er, req, res, next) => {
  // expressError = err
  let {statusCode = 500 , message='Something Wrong'} = er 
  //res.status(statusCode).send(message);
  res.status(statusCode).render('error',{er})
});


app.listen(2122,()=>{
    console.log("LISTENING")
})