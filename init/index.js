const mongoose = require("mongoose");
const initData = require("./data.js");

const Listing = require("../models/listing.js");

const MONGO_URL= "mongodb://127.0.0.1:27017/wanderlust";

main().then((res)=>{
    console.log("connected to DB");
}).catch((err)=>
{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    // if database exit some data show first we delete that data and make complete empty database

  initData.data = initData.data.map((obj) => ({...obj ,Owner :"6632407f9a360a5073a86a22"}));
    await Listing.insertMany(initData.data);
    // initdata is an object and we access key data

    console.log("data was initialized");
}
initDB();