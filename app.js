if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const cors = require('cors');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const multer = require('multer');
const { storage } = require('./CloudConfig');
const upload = multer({storage : storage});


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));

app.use(session({
    secret : "secret",
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        maxAge : 24 * 60 * 3600,
    },
}));

app.use(flash());
app.use(cors());
app.use(methodOverride("_method"));

main()
.then(() => {
    console.log("Database connected!");
})
.catch((e) => {
    console.log(e);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/Jan2");
}

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
    },
    phoneNo : {
        type : Number,
        required : true,
    },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User",userSchema);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/home",async (req,res) => {
    const data = await new User({username : 'Vaibhav Goel',email:'vaibhavgoel474@gmail.com',phoneNo: 7505448408});
    const newData = await User.register(data,'12345');
    await newData.save();
    res.json(newData);
});

app.get("/testing",(req,res) => {
    res.render("index2.ejs");
});


app.post("/testing",upload.single("image"),(req,res) => {
    console.log(req.file);
    res.redirect('/testing');
});


app.use("*",(req,res,next) => {
    throw "This page doesn't exists!";
});

app.use((req,res,next) => {
    let { error } = req.body();
    console.log(error.message);
        next();
});

app.listen(8080,() => {
    console.log('Server is listening to port 8080');
});