let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let campgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

let Campground = mongoose.model("Campground", campgroundSchema);
module.exports = Campground;
