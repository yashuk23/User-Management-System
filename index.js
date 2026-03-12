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
    console.log(`Server Started on port ${port}`);
});



function isLoggedIn(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/login");
    }

    try {

        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();

    } catch (err) {

        return res.redirect("/login");

    }

}



app.get("/", (req, res) => {
    res.redirect("/index");
});



app.get("/register", (req, res) => {
    res.render("register");
});



app.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.send("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        await userModel.create({
            name,
            email,
            password: hash
        });

        res.redirect("/login");

    } catch (error) {

        console.log(error);
        res.status(500).send("Server Error");

    }

});



app.get("/login", (req, res) => {
    res.render("login");
});



app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user || !user.password) {
            return res.send("Invalid Email or Password");
        }

        const result = await bcrypt.compare(password, user.password);

        if (!result) {
            return res.send("Invalid Email or Password");
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET
        );

        res.cookie("token", token, { httpOnly: true });

        res.redirect("/index");

    } catch (error) {

        console.log(error);
        res.status(500).send("Server Error");

    }

});



app.get("/logout", (req, res) => {

    res.clearCookie("token");
    res.redirect("/login");

});



app.get("/index", isLoggedIn, (req, res) => {

    res.render("index");

});



app.get("/read", isLoggedIn, async (req, res) => {

    const users = await userModel.find({
        createdBy: req.user.id
    });

    res.render("read", { users });

});



app.post("/create", isLoggedIn, async (req, res) => {

    try {

        const { name, email, image } = req.body;

        await userModel.create({
            name,
            email,
            image,
            createdBy: req.user.id
        });

        res.redirect("/read");

    } catch (error) {

        console.log(error);
        res.status(500).send("Server Error");

    }

});



app.get("/delete/:userid", isLoggedIn, async (req, res) => {

    await userModel.findOneAndDelete({
        _id: req.params.userid,
        createdBy: req.user.id
    });

    res.redirect("/read");

});



app.get("/edit/:userid", isLoggedIn, async (req, res) => {

    const editid = await userModel.findOne({
        _id: req.params.userid,
        createdBy: req.user.id
    });

    res.render("edit", { editid });

});



app.post("/edit/:userid", isLoggedIn, async (req, res) => {

    const { name, email, image } = req.body;

    await userModel.findOneAndUpdate(
        {
            _id: req.params.userid,
            createdBy: req.user.id
        },
        { name, email, image }
    );

    res.redirect("/read");

});