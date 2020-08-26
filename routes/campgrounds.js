var express=require("express");
var router=express.Router();
var Campgrounds=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware");


// INDEX Route ->all campgrounds page
router.get("/",function(req,res){
    Campgrounds.find({},function(err,allcampgrounds){
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("campgrounds/index",{campgrounds:allcampgrounds});
        }

    });
   
});

// CREATE ROUTE->post req to add campground
router.post("/",middleware.isLoggedIn, function(req,res){

    var name=req.body.name;
    var price=req.body.price;
    var image=req.body.image;
    var info=req.body.info;

    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newCampground={name:name,price:price,image:image,info:info,author:author};
    
    Campgrounds.create(newCampground,function(err,campground){
        if(err){
            console.log(err);
        }
        else{
            console.log("New Campground added");
            res.redirect("/campgrounds");
        }
    });
    
});



// NEW ROUTE -> add new campground form
router.get("/new",middleware.isLoggedIn,function(req,res){
    // new campground form
    res.render("campgrounds/new");
});


// SHOW ROUTE-> display one campground with particular id
router.get("/:id",function(req,res){
    
    // mongoDb generates unique id for each campground
    // findById method of mongoDb finds a campground with given id in req.params(url)
    Campgrounds.findById(req.params.id).populate("comments").exec(function(err,findcampground){

        if(err){
            console.log(err);
        }
        else{
            //console.log(findcampground);
            res.render("campgrounds/show",{campground:findcampground});
        }
    });
   
    
    });


    // Edit campground route
    router.get("/:id/edit",middleware.checkCampgroundOnwership,function(req,res){

        Campgrounds.findById(req.params.id,function(err,foundCampground){
            res.render("campgrounds/edit",{campground:foundCampground});
            });
    });



    // Update campground route
    router.put("/:id",middleware.checkCampgroundOnwership, function(req,res){
        Campgrounds.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
            if(err){
                res.redirect("/campgrounds");
            }
            else{
                res.redirect("/campgrounds/"+req.params.id);
            }
        });
    });

    // Destroy Campground route
    router.delete("/:id",middleware.checkCampgroundOnwership, function(req,res){
        Campgrounds.findByIdAndRemove(req.params.id,function(err){
            if(err){
                res.redirect("/campgrounds");
            }
            else{
                res.redirect("/campgrounds");
            }
        });
    });

/*
// middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
}


// middleware2
function checkCampgroundOnwership(req,res,next){
    // isUser logged in?
    if(req.isAuthenticated()){
        Campgrounds.findById(req.params.id,function(err,foundCampground){
            if(err){
                res.redirect("back");
            }
            else{
                // if logged in does user own campground
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }
               else{
                res.redirect("back");
               }
            }
        });

    }
    else{
        res.redirect("back");
    }
}
*/
module.exports = router;