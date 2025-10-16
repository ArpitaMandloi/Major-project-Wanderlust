const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const List = await Listing.findById(id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id ;
  console.log(newReview);
  List.reviews.push(newReview);
  await newReview.save();
  await List.save();
 req.flash("success","new Review Created");
  res.redirect(`/listings/${List._id}`);
};


module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted");
  res.redirect(`/listings/${id}`);
};