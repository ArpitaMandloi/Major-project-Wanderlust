const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const {validateReview, isLoggedIn , isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");


// create review 
router.post("/:id",isLoggedIn, validateReview , wrapAsync(reviewController.createReview));

   // review - Delete
router.delete("/:id/:reviewId", 
  isLoggedIn ,
  isReviewAuthor , 
  wrapAsync(reviewController.deleteReview));

  module.exports = router;