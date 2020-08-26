// all middleware
var Campgrounds=require("../models/campground");
var Comment=require("../models/comment");
var middlewareObj={};

middlewareObj.checkCampgroundOnwership=function(req,res,next){
        // isUser logged in?
        if(req.isAuthenticated()){
            Campgrounds.findById(req.params.id,function(err,foundCampground){
                if(err){
                    req.flash("error","Campground not found.");
                    res.redirect("back");
                }
                else{
                    // if logged in does user own campground
                    if(foundCampground.author.id.equals(req.user._id)){
                        next();
                    }
                   else{
                    req.flash("error","You don't have permission to do that.");
                    res.redirect("back");
                   }
                }
            });
    
        }
        else{
            req.flash("error","You need to be logged in to do that.");
            res.redirect("back");
        }
    }

middlewareObj.checkCommentOnwership= function(req,res,next){
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
                    req.flash("error","You don't have permission to do that.");
                    res.redirect("back");
                   }
                }
            });
    
        }
        else{
            req.flash("error","You need to be logged in to do that.");
            res.redirect("back");
        }
    }

middlewareObj.isLoggedIn =function(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    req.flash("error","You need to be logged in to do that.");
    res.redirect("/login");
}


module.exports=middlewareObj;