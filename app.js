const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}));

app.use(session({
    secret : "Mytopsecret",
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
    }
}));

app.use(flash());
app.use(methodOverride("_method"));
app.use(cors());

main()
.then(() => {
    console.log("Connection successful");
})
.catch((e) => {
    console.log(e);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/January");
}

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
    },
    phoneNo : {
        type : Number,
        required : true,
    }
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User",userSchema);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/home",(req,res) => {
    res.send("Hello!");
});


app.get("/first",async (req,res) => {
    let data = await new User({username : 'Varun',email : 'Vaibhavgoel474@gmail.com',phoneNo : 7505448408});
    let newData = await User.register(data,'1234');
    await newData.save();
    res.json(newData);
});

app.listen(8080,() => {
    console.log("Server is listening to port 8080!");
});