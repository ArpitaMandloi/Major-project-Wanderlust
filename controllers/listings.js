const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");

// index route 
module.exports.index = async (req,res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index",{alllistings});
};

// new route
module.exports.rendernewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// show route
module.exports.showListing = async(req , res) => {
  let {id} = req.params;
  const foundListing = await Listing.findById(id)
    .populate({
      path : "reviews",
      populate : {
        path : "author",
      },
    })
    .populate("owner");

  if (!foundListing) {
    req.flash("error","Listing you requested for does not exist !");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing: foundListing });
};

// create route
module.exports.createListing = async(req,res) => {
  let url = req.file ? req.file.path : "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60";
  let filename = req.file ? req.file.filename : "defaultimage";

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url , filename};
  await newListing.save();
  req.flash("success","new Listing Created");
  res.redirect("/listings");
};

// edit route
module.exports.editListing = async(req,res)=>{
  let {id} = req.params;
  const foundListing = await Listing.findById(id);
  if(!foundListing) {
    req.flash("error",'listing you requested for does not exist!');
    return res.redirect("/listings");
  }

  let originalImageUrl = (foundListing.image && foundListing.image.url) ? foundListing.image.url : "";
  if (originalImageUrl) {
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
  }
  res.render("listings/edit.ejs", { foundListing , originalImageUrl});
};

//update route 
module.exports.updatelisting = async (req,res) => {
  let {id} = req.params;
  let updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

  if (!updatedListing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = {url , filename};
    await updatedListing.save();
  }

  req.flash("success"," Listing Updated");
  res.redirect(`/listings/${updatedListing._id}`);
};

// delete route
module.exports.deletelisting = async (req,res) => {
  let {id} = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success"," Listing Deleted!");
  res.redirect("/listings");
};