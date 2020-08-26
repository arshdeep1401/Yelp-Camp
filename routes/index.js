var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");
var nodemailer = require('nodemailer');

// Home Route
router.get("/",function(req,res){
    // landing.ejs -> home page
    res.render("landing");

});



//-----------
//Auth Routes
//-----------


//register

router.get("/register",function(req,res){
    res.render("login");
});


router.post("/register",function(req,res){
    
    User.register(new User({username:req.body.username,email:req.body.email}),req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
            req.flash("error",err.message);
            return res.render("login");
        }

        passport.authenticate("local")(req,res,function(){

            // send email after successful sign up
            var emailMessage = `Hi ${user.username},\n\nThank you for contacting us.\n\nYour email is: ${user.email}.\n\n`;

            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                  user: 'hello.yelpcamp@gmail.com',
                  pass: 'yelpcamp123'
                }
              });
            
              var emailOptions = {
                from: 'Team YelpCamp hello.yelpcamp@gmail.com',
                to: user.email,
                subject: 'Welcome to YelpCamp',
                text: "Hello "+user.username+". Thank You for registering with YelpCamp. You can now view from our hand-picked campgrounds from all over the world."
              };
            
              transporter.sendMail(emailOptions, (err, info) => {
                if (err) {
                  console.log(err);
                  res.redirect('/login');
                } else {
                    console.log('Message Sent: ' + info.response);
                    console.log('Email Message: ' + emailMessage);
                    req.flash("success","Welcome to YelpCamp "+user.username);
                    res.redirect("/campgrounds");
                }
              });
            
        });
    });
});

//login




router.get("/login",function(req,res){
    res.render("login");
});




router.post("/login",passport.authenticate("local",
{
    successRedirect:"/campgrounds",
    failureRedirect:"/login",
    failureFlash:true
}));

router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged You out!");
    res.redirect("/campgrounds");
});

// middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
}

module.exports=router;