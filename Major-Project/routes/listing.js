const express = require("express")
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js")


const validateListing = (req,res,next) =>
  { let {error} = listingSchema.validate(req.body);   
  if(error){ 
    let errMsg = error.details.map((el) => el.message).join(","); 
    throw new ExpressError(400 , errMsg); 
  }else
     { next(); 

  } }

// index route 

router.get("/" ,wrapAsync (async (req,res) => {
const alllistings = await Listing.find({})
res.render("listings/index",{alllistings});
  }));

//new route

router.get("/new",isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});


// show route

router.get("/:id" , wrapAsync (async(req , res) => {
  let {id} = req.params;
const foundListing = await Listing.findById(id).populate("reviews");
if (!foundListing) {
   req.flash("error","Listing you requested for does not exist !");
   res.redirect("/listings")
}
res.render("listings/show.ejs", { listing: foundListing });
}));

// create route

router.post("/",isLoggedIn,validateListing,
  wrapAsync(async(req,res) => {

  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success","new Listing Created");
  res.redirect("/listings");
  
})
);

//Edit route

router.get("/:id/edit",isLoggedIn,wrapAsync (async(req,res)=>{
   let {id} = req.params;
  const foundListing =  await Listing.findById(id);
 res.render("listings/edit.ejs", { foundListing });

}));

//update route

router.put("/:id",isLoggedIn,validateListing,
  wrapAsync (async (req,res) => {
  let {id} = req.params;
const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
if (!updatedListing) {
  throw new ExpressError(404, "Listing not found");
}
req.flash("success"," Listing Updated");
res.redirect(`/listings/${updatedListing._id}`);

}))

//Delete route

router.delete("/:id" ,isLoggedIn, wrapAsync (async (req,res) => {
  let  {id} = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success"," Listing Deleted!");
  res.redirect("/listings")
}));

module.exports = router;