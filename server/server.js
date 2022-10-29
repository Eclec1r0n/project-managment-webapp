const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userList=require("./Database/user");
const routes = require("./Routes/router");
const passport=require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bodyParser=require("body-parser");
const cookieSession = require("cookie-session");
const app=express();

require("dotenv").config();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())


app.set("trust proxy", 1);

app.use(
  cookieSession({ 
    name: "session", 
    keys: ["user"], 
    maxAge: 60*60*24*7*365*1000, 
})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods:"GET,POST,PUSH,DELETE",
    credentials: true
  })
);

mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
},()=>{console.log("Mongoose connection Successful")});


passport.use(userList.createStrategy());
const findOrCreate= async (profile,cb)=>{
  userList.findOne({
    "email": profile.emails[0].value 
}, async (err, user) =>{
    if (err) 
        return cb(err,null);
    if (!user) {
        const newUser = new userList({
            name: profile.displayName,
            email: profile.emails[0].value,
        });
        await newUser.save(function(err) {
            if (err) console.log(err);
            cb(null, newUser);
        });
    } else {
        cb(null, user);
    }
  });
}

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
  findOrCreate(profile,cb)
}
));

passport.serializeUser(userList.serializeUser());
passport.deserializeUser(userList.deserializeUser());

app.use("/",routes);

app.listen(process.env.PORT, ()=> {
    console.log("Server started on port 8080");
});