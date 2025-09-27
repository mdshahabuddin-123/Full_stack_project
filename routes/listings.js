const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require('../models/listing.js');
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

///Cloudinary 
const multer = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})


const listingController = require("../controllers/listings.js")



router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
)

// .post(upload.single('listing[image]'),(req,res) => {
//     res.send(req.file);
// }


// New form render
router.get("/new",isLoggedIn, listingController.renderNewForm )


router.route("/:id")
.get( 
    wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingController.updateListing))
.delete( 
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing))



//edit Route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm))







module.exports = router;







// without router.route

// // index route
// router.get("/", wrapAsync(listingController.index));


// // New form render
// router.get("/new",isLoggedIn, listingController.renderNewForm )


// // show Route
// router.get(
//     "/:id", 
//     wrapAsync(listingController.showListing))



// /// Create route
// router.post(
//     "/",
//     isLoggedIn,
//     validateListing,
//     wrapAsync(listingController.createListing))



// //edit Route
// router.get(
//     "/:id/edit",
//     isLoggedIn,
//     isOwner,
//     wrapAsync(listingController.renderEditForm))


// // UPDATE Route
// router.put(
//     "/:id",
//     isLoggedIn,
//     isOwner,
//     validateListing, 
//     wrapAsync(listingController.updateListing))

// // Delete Route
// router.delete(
//     "/:id", 
//     isLoggedIn,
//     isOwner,
//     wrapAsync(listingController.destroyListing))


// module.exports = router;