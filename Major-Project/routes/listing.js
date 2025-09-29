const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");


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
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// show route

router.get("/:id" , wrapAsync (async(req , res) => {
  let {id} = req.params;
const foundListing = await Listing.findById(id).populate("reviews");
if (!foundListing) {
  throw new ExpressError(404, "Listing not found");
}
res.render("listings/show.ejs", { listing: foundListing });
}));

// create route
router.post("/",validateListing,
  wrapAsync(async(req,res) => {

  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
  
})
);
//Edit route

router.get("/:id/edit",wrapAsync (async(req,res)=>{
   let {id} = req.params;
  const foundListing =  await Listing.findById(id);
 res.render("listings/edit.ejs", { foundListing });

}));

//update route
router.put("/:id",validateListing,
  wrapAsync (async (req,res) => {
  let {id} = req.params;
const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
if (!updatedListing) {
  throw new ExpressError(404, "Listing not found");
}
res.redirect(`/listings/${updatedListing._id}`);

}))

//Delete route
router.delete("/:id" , wrapAsync (async (req,res) => {
  let  {id} = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  res.redirect("/listings")
}));

module.exports = router;