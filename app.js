if(process.env.NODE_ENV !="production"){
 require('dotenv').config();
}

// console.log(process.env.SECRET);


const express = require('express');
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const app = express();
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")


// for Authentication
const session = require("express-session");
// store session 
const MongoStore = require('connect-mongo')
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")


/// router.router
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "/public")))
// To parse data 
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


//  const mongo_url = 'mongodb://127.0.0.1:27017/airbnb'
const dbUrl = process.env.ATLASDB_URL;



main().
then((result) => {
    console.log("Connection successfully")
})
.catch((err) => {
    console.log(err)
})

async function main() {
  await mongoose.connect(dbUrl);


}


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error", () =>{
    console.log("ERROR in MONGO SESSION STORE",err);
})


const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    },
}

// app.get("/", (req,res) => {
//     res.send("Hey i am a root route")
// });


// for Authentication
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//when we store user related  informatoin in session then it is called serializeuser
//when we removew user related informatoin in session then it is called deserializeuser
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// Local Variable
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
}) 





app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);






app.use((req,res,next) => {
    next(new ExpressError(404, "page not found"))
})


app.use((err, req,res,next) => {
  const { statusCode = 500, message = "something went wrong"} = err;
  res.status(statusCode).render("error.ejs", {message})
//   res.status(statusCode).send(message);
})



app.listen(8080, (req, res) => {
    console.log("server start at port number 8080")
})




// app.get("/user", async(req, res)=>{
//     let fakeUser = new User({
//         username : "md shahabudin khan",
//         email: "mdshahakhan@gmail.com"
//     })
//     let finalUser = await User.register(fakeUser,"helloworld");
//     res.send(finalUser)

// })