const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req,res) => {

    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
 
    let newReview =new Review(req.body.review);
    newReview.author =req.user._id;
    listing.reviews.push(newReview);
 
   await newReview.save();
   await listing.save();
 
 //   console.log(" new review saved");
 //   res.send("new review saved");
 req.flash("success" ,"new review created");
 res.redirect(`/listings/${listing._id}`);
 }

 module.exports.destroyReview = async (req,res) =>{
    let { id , reviewId} =req.params;

   await Listing.findByIdAndUpdate(id , {$pull : {reviews :reviewId}});
   // of $pull is to remove or pull the data to an array in that reviews array mathi je reviewId match thai jai ene pull kari levu
    await Review.findByIdAndDelete(reviewId);

    req.flash("success" ,"Review deleted");
    res.redirect(`/listings/${id}`);
}