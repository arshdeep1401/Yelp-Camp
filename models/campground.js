var mongoose=require("mongoose");

var campgroundSchema=new mongoose.Schema({

    name:String,
    price:String,
    image:String,
    info:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    // an array of id's of comments(we use these id to get the whole comment)
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
}); 

var Campgrounds =mongoose.model("Campgrounds",campgroundSchema);
module.exports=Campgrounds;