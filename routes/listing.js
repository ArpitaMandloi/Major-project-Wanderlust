const express = require("express")
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js")
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const{storage} = require("../cloudConfig.js");
const upload = multer({storage});

//new route

router.get("/new",isLoggedIn,listingController.rendernewForm );
 
// index route  & create route
router.route("/")
   .get(wrapAsync(listingController.index))
   .post(
      isLoggedIn,
      upload.single("listing[image]"),
      validateListing,
      wrapAsync(listingController.createListing)
);
  

// show and update and delete
router.route("/:id")
     .get( wrapAsync (listingController.showListing))
     .put(
      isLoggedIn, 
      isOwner , 
      upload.single("listing[image]"),
      validateListing,
      wrapAsync (
         listingController.updatelisting))
         .delete(
            isLoggedIn, 
            isOwner , 
            wrapAsync (listingController.deletelisting));

//Edit route

router.get("/:id/edit",isLoggedIn,isOwner , wrapAsync (listingController.editListing));


module.exports = router;