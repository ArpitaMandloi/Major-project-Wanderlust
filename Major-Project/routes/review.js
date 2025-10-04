const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const  {reviewSchema} = require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

const validateReview = (req,res,next) =>{ 
  let {error} = reviewSchema.validate(req.body); 
      if(error){ 
        let errMsg = error.details.map((el) => el.message).join(","); 
      throw new ExpressError(400 , errMsg);
   } 
      else { 
        next(); 
      } }

router.post("/:id", validateReview , wrapAsync(async (req, res) => {
  const { id } = req.params;
  const List = await Listing.findById(id);
  if (!List) {
    throw new ExpressError(404, "Listing not found");
  }

  const newReview = new Review(req.body.review);
  List.reviews.push(newReview);
  await newReview.save();
  await List.save();
 req.flash("success","new Review Created");
  res.redirect(`/listings/${List._id}`);
}));

   // review - Delete
router.delete("/:id/:reviewId", wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted");
  res.redirect(`/listings/${id}`);
}));

  module.exports = router;