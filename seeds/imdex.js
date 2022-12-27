let mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/yelpCamp_authorization")
  .then(() => {
    console.log("CONNECTION ESTD !!!");
  })
  .catch((err) => {
    console.log("OH NO ERROR !!!");
    console.log(err);
  });

let Campground = require("../models/campground");
let cities = require("./cities");
let { places, descriptors } = require("./seedHelpers");

// function sample(array) {
//   array[Math.floor(Math.random() * array.length)];
// }
const sample = array => array[Math.floor(Math.random() * array.length)];

async function seedDB() {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    let random = Math.floor(Math.random() * 1000);
    let price = Math.floor(Math.random() * 30) +20
    
    let camp = new Campground({
      author: '635608851f6b8efae9f07c31',
      //author,
        location: `${cities[random].city}, ${cities[random].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image : 'http://source.unsplash.com/collection/484351',
      description : 'hello boy',price
    });

    await camp.save();
  }
}

seedDB().then(() => {
    mongoose.connection.close();
})
