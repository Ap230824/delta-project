const express = require("express");
const router = express.Router({mergeParams : true});
// this mergeParams are merge item of parent route to there child route
// express.router give the router object

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError =require("../utils/ExpressError.js");


const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { merge } = require("./listing.js");
const {validateReview, isLoggedIn, isreviewAuthor} =require("../middleware.js");

const  reviewController = require("../controllers/reviews.js")

//REVIEWS post route
router.post("/" , isLoggedIn ,
  validateReview, wrapAsync(reviewController.createReview));
 
 //review delete route
router.delete("/:reviewId" ,isLoggedIn , isreviewAuthor,
   wrapAsync(reviewController.destroyReview));

 module.exports = router ;