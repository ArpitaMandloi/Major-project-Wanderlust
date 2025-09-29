// models/listing.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1755371034010-51c25321312d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"
          : v,
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews :[
    {
      type : Schema.Types.ObjectId,
      ref : "Review",
    }
  ]
});

listingSchema.post("findOneAndDelete",async(listing) => {
  if(listing) {
      await Review.deleteMany({_id : {$in : listing.reviews}});
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;