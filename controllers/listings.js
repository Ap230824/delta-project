 const Listing =require("../models/listing");
 const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
 const mapToken =process.env.MAP_TOKEN;
 const geocodingClient = mbxGeocoding({ accessToken: mapToken});
 
 module.exports.index=async(req,res)=>
{
  const allListings= await Listing.find({});
  res.render("listings/index.ejs" , {allListings});
}

module.exports.renderNewForm =  (req,res)=>
{   
    res.render("listings/new.ejs");
}

module.exports.showListing = async(req,res)=>{
    let {id }= req.params;
  const listing=  await Listing.findById(id).populate({path : "reviews" , populate :{path :"author" }, }).populate("Owner");  

  if(!listing){
    req.flash("error" ,"Listing are not exists");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs" ,{listing});
}

module.exports.createListing = async(req,res,next)=>
{   

 let respone = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
    .send();
    
    
  let url = req.file.path;
  let filename = req.file.filename;
    const newListinng= new Listing(req.body.listing);
    // console.log(req.user);
    newListinng.Owner = req.user._id;
    newListinng.image= { url , filename};
    newListinng.geometry = respone.body.features[0].geometry;

    let savedListing= await newListinng.save();
    console.log(savedListing);
     req.flash("success" ,"new listing created");
    res.redirect("/listings");
   
}

module.exports.renderEditForm = async(req,res)=>
{
    let {id }= req.params;
    const listing=  await Listing.findById(id); 

    if(!listing){
      req.flash("error" ,"Listing are not exists");
      res.redirect("/listings");
    }
    let originalImageUrl =listing.image.url;
    originalImageUrl.replace("/upload" ,"/upload/w_250");

    res.render("listings/edit.ejs" ,{ listing ,originalImageUrl});
}

module.exports.updateListing = async(req,res)=>
{
    let { id } =req.params;
 let listing= await Listing.findByIdAndUpdate(id , {...req.body.listing});

 if(typeof req.file !== "undefined"){
 let url = req.file.path;
 let filename = req.file.filename;
 listing.image = {url , filename};
 await  listing.save();
 }
  req.flash("success" ,"existing listing are successfully updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async(req,res)=>
{
    let {id}=req.params;
   let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success" ,"listing deleted");
    res.redirect("/listings");
}