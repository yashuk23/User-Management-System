const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;

const userModel = require("./models/user");

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("Connection Error:", err));

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.listen(port, () => {
    console.log("Server Started");
});


function isLoggedIn(req, res, next) {

    if (!req.cookies.token) {
        return res.redirect("/login");
    }

    try {
        let data = jwt.verify(req.cookies.token, "secretkey");
        req.user = data;
        next();
    }
    catch (err) {
        res.redirect("/login");
    }
}



app.get("/", (req, res) => {
    res.redirect("/login");
});


//register

app.get("/register", (req, res) => {
    res.render("register");
});


app.post("/register", async (req, res) => {

    let { name, email, password, image } = req.body;

    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);

    await userModel.create({
        name,
        email,
        password: hash,
        image
    });

    res.redirect("/login");
});


//login

app.get("/login", (req, res) => {
    res.render("login");
});


app.post("/login", async (req, res) => {

    let user = await userModel.findOne({ email: req.body.email });

    if (!user) {
        return res.send("Invalid Email or Password");
    }

    let result = await bcrypt.compare(req.body.password, user.password);

    if (result) {

        let token = jwt.sign(
            { email: user.email, id: user._id },
            "secretkey"
        );

        res.cookie("token", token);

        res.redirect("/read");
    }
    else {
        res.send("Invalid Email or Password");
    }

});


//logout

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/login");
});

//dashboard

app.get("/read", isLoggedIn, async (req, res) => {

    let users = await userModel.find();

    res.render("read", { users });

});


//create user

app.post("/create", isLoggedIn, async (req, res) => {

    let { name, email, image } = req.body;

    await userModel.create({
        name,
        email,
        image
    });

    res.redirect("/read");

});


//user delete

app.get("/delete/:userid", isLoggedIn, async (req, res) => {

    await userModel.findOneAndDelete({ _id: req.params.userid });

    res.redirect("/read");

});


//user edit

app.get("/edit/:userid", isLoggedIn, async (req, res) => {

    let editid = await userModel.findOne({ _id: req.params.userid });

    res.render("edit", { editid });

});


//user update 

app.post("/edit/:userid", isLoggedIn, async (req, res) => {

    let { name, email, image } = req.body;

    await userModel.findOneAndUpdate(
        { _id: req.params.userid },
        { name, email, image }
    );

    res.redirect("/read");

});