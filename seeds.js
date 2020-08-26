var mongoose=require("mongoose");
var Campgrounds=require("./models/campground");
var Comment=require("./models/comment");

// arbitrary data for seeding the website at the beginning
var data=[
    {
        name:"Mount A",
        image:"https://cdn.pixabay.com/photo/2016/11/21/15/14/camping-1845906__340.jpg",
        info:"This is mountain A located in Himalayas"
    },

    {
        name:"Mount B",
        image:"https://cdn.pixabay.com/photo/2019/10/03/11/14/camp-4522970__340.jpg",
        info:"This is mountain B located in Himalayas"
    },

    {
        name:"Mount C",
        image:"https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg",
        info:"This is mountain C located in Himalayas"
    }
]
function seedDB(){

    // remove previously existing data(campgrounds) and add seed data
    Campgrounds.remove({},function(err){
        if(err)
        {
            console.log(err);
        }
        else{
            console.log("All campgrounds removed");
    
            // adding seed data
            data.forEach(function(seed){
                Campgrounds.create(seed,function(err,campground){
                    if(err)
                    {
                        console.log(err);
                    }
                    else{
                        console.log("New campground added");
                        Comment.create({
                            text:"this mountain is great you should definately visit it",
                            author:"Arsh"
                        },function(err,comment){
                            if(err){
                                console.log(err);
                            }
                            else{
                                campground.comments.push(comment);
                                campground.save();
                                
                                console.log("added new comment");
                            }
                        });
                    }
                });
    
            })
    
        }
    
    });

}

module.exports=seedDB;
