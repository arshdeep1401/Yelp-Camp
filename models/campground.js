var mongoose=require("mongoose");

var campgroundSchema=new mongoose.Schema({

    name:String,
    image:String,
    info:String,
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
}); 

var Campgrounds =mongoose.model("Campgrounds",campgroundSchema);
module.exports=Campgrounds;