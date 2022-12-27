let express = require("express");
let router = express.Router({mergeParams: true});
let expressError = require('../Error/expres_error')
let catchAsync = require('../Error/catch_Async')
let Campground = require('../models/campground');
let Review = require('../models/review')
let { reviewSchema} = require("../joiSchema.js");
let {isLoggedIn} = require('../auth_middlware')


let validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let msg = error.details.map((el) => el.message).join(",");
      throw new expressError(msg, 400);
    } else {
      next();
    }
  };



router.post("/", isLoggedIn , validateReview , async (req, res) => {
    let thatId = await Campground.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id
    //console.log(newReview)
    thatId.reviews.push(newReview);
    await newReview.save();
    await thatId.save();
    res.redirect(`/campgrounds/${thatId._id}`);
    //res.send('review')
  });
  
  router.delete('/:reviewId',catchAsync(async(req,res)=>{
    let {id , reviewId} = req.params
    await Campground.findByIdAndUpdate(id,{$pull: {reviews : reviewId}})
    await Review.findOneAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
  }))

  module.exports = router;