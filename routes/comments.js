var express=require("express");
// used mergeParams for merging parameter of campground and comments(to get /:id)
var router=express.Router({mergeParams:true});
var Campgrounds=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware");


// new comment
router.get("/new",middleware.isLoggedIn,function(req,res){
    Campgrounds.findById(req.params.id,function(err,campground){

        if(err)
        {
            console.log(err);
        }
        else{
            res.render("comments/new",{campground:campground});
        }
    });
    
});


router.post("/",middleware.isLoggedIn,function(req,res){
    Campgrounds.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err)
                {
                    console.log(err);
                }
                else{
                    // add username and id to comment
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Successfully Added Comment!");
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});


// edit route
router.get("/:comment_id/edit",middleware.checkCommentOnwership, function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.render("comments/edit",{campground_id: req.params.id,comment: foundComment});
        }
    });
    
});


// update route

router.put("/:comment_id",middleware.checkCommentOnwership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


// delete comment 

router.delete("/:comment_id",middleware.checkCommentOnwership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
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


// middleware 2

function checkCommentOnwership(req,res,next){
    // isUser logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                res.redirect("back");
            }
            else{
                // if logged in does user own comment
                if(foundComment.author.id.equals(req.user._id)){
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
module.exports=router;