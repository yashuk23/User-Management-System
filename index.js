const express=require("express");
const path=require("path");
const app=express();
const port=8080;
const userModel=require("./models/user");
const { log } = require("console");

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.listen(port,()=>
{
    console.log("Server Started");
});

app.get("/",(req,res)=>
{
    res.render("index");
})

app.post("/create",async (req,res)=>
{
    let {name,email,image}=req.body;
    let createdUser= await userModel.create({
        name:name,
        email:email,
        image:image
    })

    res.redirect("/read")
})

app.get("/read",async (req,res)=>
{
    let users=await userModel.find();
    res.render("read",{users})
})

app.get("/delete/:userid",async (req,res)=>
{
    let userId=req.params.userid;
    let deleteUser=await userModel.findOneAndDelete({_id:userId});
    console.log(deleteUser);
    res.redirect("/read");
})

app.get("/edit/:userid",async (req,res)=>
{
    let editid=await userModel.findOne({_id:req.params.userid});
    res.render("edit",{editid});
})

app.post("/edit/:userid",async (req,res)=>
{
    let {name,email,image}=req.body;
    let editedUser=await userModel.findOneAndUpdate({_id:req.params.userid},{name:name,email:email,image:image});
    res.redirect("/read");
});
