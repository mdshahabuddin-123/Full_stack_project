const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next)=>{
    // console.log(req.user)
    // console.log(req.path, "..", req.originalUrl);

    if(!req.isAuthenticated()){
        //redirectUlr if user acccess create listing then after login redirect
        //login route not all listings
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login")
    }
    next();
}


 //redirectUlr if user acccess create listing then after login redirect
//login route not all listings
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


/// implement authorization for all listing
module.exports.isOwner = async(req, res, next)=> {
    let{ id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error", "You are not the author of  this listing")
     return res.redirect(`/listings/${id}`)
    }
    next()
}


/// implement authorization for all reviews
module.exports.isreviewAuthor = async(req, res, next)=> {
    let{id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error", "You are not the author of  this review")
     return res.redirect(`/listings/${id}`)
    }
    next()
}


// VALIDATIN FOR SERVER SIDE WITH Joi
module.exports.validateListing = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}
// validation for reviews
module.exports.validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}