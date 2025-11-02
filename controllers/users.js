const User = require("../models/user.js");


// render signupform
module.exports.renderSignupform = (req,res) =>{
  res.render("users/signup.ejs");
}

//signup
module.exports.signup = async(req,res) =>{
   try{
    let {username , email , password} = req.body;
    const newUser = new User({email , username});
    const registeredUser = await User.register(newUser , password);
    console.log(registeredUser);
    req.login(registeredUser,(err) =>{
      if(err) {
        return next(err);
      }
      req.flash("success","user was registered successfully");
    res.redirect("/listings");
    });
   }
   catch(e){
     req.flash("error",e.message);
     res.redirect("/signup");
   }
};

// render login form 

module.exports.renderLoginform = (req,res) =>{
  res.render("users/login.ejs");
}

// successfull login
module.exports.login =  (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings" ;
    res.redirect(redirectUrl);
  };

module.exports.logout = (req,res) =>{
    req.logout((err) =>{
      if(err){
        return next(err);
      };
      req.flash("success" , "you are logges out!");
      res.redirect("/listings");
    })
};