const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const ejsMate = require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js")


main().then(()=>{console.log("connected to DB")})
.catch((err)=>{console.log(err)});

async function main() { 
  await mongoose.connect(MONGO_URL);
 }
app.set("view engine","ejs"); app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate); app.use(express.static(path.join(__dirname,"/public")));
app.get("/",(req,res)=>{ 
  res.send("Hi , I am root") ;

});




app.use("/listings",listings);
app.use("/reviews",reviews);



app.use((req, res, next) => { 
  next(new ExpressError(404, "Page not found!"));
 });

app.use((err , req, res , next) =>{ 
  let {statuscode = 500  , message = "something went wrong"} = err; res.status(statuscode).send(message);
 });

port = 200;
app.listen(port,()=>{
   console.log("server is working") ;
});
