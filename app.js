
if(process.env.NODE_ENV != "production")
{
    require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing = require("./models/listing.js");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate =require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError =require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} =require("./schema.js");
const Review = require("./models/review.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport =require("passport");
const LocalStrategy =require("passport-local");
const User = require("./models/user.js");

app.set("view engine" ,"ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// const MONGO_URL= "mongodb://127.0.0.1:27017/wanderlust";
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const dbUrl = process.env.ATALSDB_URL;

main().then((res)=>{
    console.log("connected to DB");
}).catch((err)=>
{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
});


store.on("error" ,() =>{
    console.log("ERROR in MONGO SESSION STORE" , err);
});

    const sessionOption = {
        store,
        secret : process.env.SECRET,
        resave : false,
        saveUninitialized : true,

        cookie : {
            expires : Date.now() + 7 * 24 * 60 *  60 * 1000 ,
            maxAge : 7 * 24 * 60 * 60 * 1000,
            httpOnly : true,
            // the httponly are used for security purpose
        },
    }
    // app.get("/",(req,res)=>
    // {
    //     res.send("Hi, I am listening your request");
    // });

  

   app.use( session(sessionOption)); 
    app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    // here success is array and is an empty array
    res.locals.error =req.flash("error");
    res.locals.currUser =req.user;
    next();
});

 app.use("/listings" , listingRouter);   
 app.use("/listings/:id/reviews" , reviewRouter);
 app.use("/" ,userRouter);

    // if user get to an unwanted route  it redirect to this 
    // it check all routes if not found that coming to this route

  app.all("*" , async(req,res,next) =>
{
    next( new ExpressError(404 , "Page Not Found"));
});
     
// error handling  middleware
app.use((err,req,res,next) =>
{
    
    let { status=500 ,message="something wrong" } = err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs" , { message });
});

app.listen(8080,(req,res)=>
{
    console.log("server is listening in port 8080");
});