const User = require("../models/user.js");
module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.signup = async(req, res) => {

try{
    let {username, email, password} = req.body;
    const newUser = new User({
        username,
        email
    })
   let registerUser =  await User.register(newUser, password);

   // login after signup
   req.login(registerUser, (err) =>{
    if(err){
        return next(err);
    }
      req.flash("success", "User Register successful!")
      res.redirect("/listings");
   }
  )}
   catch(error){
        req.flash("error", error.message)
        res.redirect("/signup");
    }
   
}


module.exports.renderLogginForm =  (req, res) => {
    res.render("users/login.ejs")
}



module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    //redirectUlr if user acccess create listing then after login redirect
    //login route not all listings
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}



module.exports.logout = (req, res, next) => {
    req.logOut((error) => {
        if(error){
            return next(error)
        }
        req.flash("success", "Good bye you are logout")
        res.redirect("/listings");
    })
}