let express = require("express");
let router = express.Router();
let expressError = require('../Error/expres_error')
let catchAsync = require('../Error/catch_Async')
let Campground = require("../models/campground");
let { errorSchema} = require("../joiSchema.js");
//let Review = require('./models/review')

let {isLoggedIn} = require('../auth_middlware')

// let isAuthor = async(req,res,next) =>{
//   let {id} = req.params
//   let camp = await Campground.findById(id)
//   if(!camp.author.equals(req.user._id)){
//     req.flash("error", "You dont've the permission to do that");
//     return res.redirect(`/campgrounds/${id}`);
//   }
//   next()
// }

let validateForm = (req, res, next) => {
  let { error } = errorSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new expressError(msg, 400);
  } else {
    next();
  }
};

router.get("/", catchAsync(async (req, res, next) => {
  let result = await Campground.find({});
  res.render("campgrounds/index", { result });
}));

router.get("/new", isLoggedIn, (req, res) => {
  //
  res.render("campgrounds/new");
});

router.post("/", isLoggedIn,validateForm,catchAsync(async (req, res, next) => {
  let another = new Campground(req.body.camp);
  another.author = req.user._id
  await another.save();
  console.log(another);
  req.flash("success", "Successfully created new campgrounds");
  res.redirect(`/campgrounds/${another._id}`);
}));

router.get("/:id", catchAsync(async (req, res, next) => {
  let id = await Campground.findById(req.params.id).populate({
    path : "reviews",
    populate : {
      path: 'author'
    }
  }).populate('author');
  console.log(id)
  if (!id) {
    req.flash("error", "Campground is not found");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/id", { id });
}));

router.get("/:id/edit",isLoggedIn, catchAsync(async (req, res, next) => {
  let {id} = req.params
  let edit = await Campground.findById(id);
  if (!edit) {
    req.flash("error", "Campground is not found");
    res.redirect("/campgrounds");
  }
  if(!edit.author.equals(req.user._id)){
    req.flash("error", "You dont've the permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  res.render("campgrounds/edit", { edit });
}));

router.put("/:id", isLoggedIn,catchAsync(async (req, res, next) => {
  let {id} = req.params
  let theUser = await Campground.findById(id)
  if(!theUser.author.equals(req.user._id)){
    req.flash("error", "You dont've the permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  let put = await Campground.findByIdAndUpdate(id, {...req.body.camp}, {
    runValidators: true,
    new: true,
  });
  req.flash("success", "Successfully update this campground");
  res.redirect(`/campgrounds/${put._id}`);
}));

router.delete("/:id", isLoggedIn,catchAsync(async (req, res) => {
  let dlt = await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully delete the campground");
  res.redirect("/campgrounds");
}));

module.exports = router;
