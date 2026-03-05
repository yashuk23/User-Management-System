const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 8080;

const userModel = require("./models/user");

mongoose.connect("mongodb+srv://yashuk23:yashuk23@usermanagement.iiq96s2.mongodb.net/UserManagement")
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log("Connection Error:", err);
});

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
    console.log("Server Started");
});

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/create", async (req, res) => {
    let { name, email, image } = req.body;

    await userModel.create({
        name,
        email,
        image
    });

    res.redirect("/read");
});

app.get("/read", async (req, res) => {
    let users = await userModel.find();
    res.render("read", { users });
});

app.get("/delete/:userid", async (req, res) => {
    await userModel.findOneAndDelete({ _id: req.params.userid });
    res.redirect("/read");
});

app.get("/edit/:userid", async (req, res) => {
    let editid = await userModel.findOne({ _id: req.params.userid });
    res.render("edit", { editid });
});

app.post("/edit/:userid", async (req, res) => {
    let { name, email, image } = req.body;

    await userModel.findOneAndUpdate(
        { _id: req.params.userid },
        { name, email, image }
    );

    res.redirect("/read");
});