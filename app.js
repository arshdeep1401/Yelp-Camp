var express                 =require("express"),
    app                     =express(),
    bodyParser              =require("body-parser"),
    passport                =require("passport"),
    LocalPassport           =require("passport-local"),
    passportLocalMongoose   =require("passport-local-mongoose"),
    mongoose                =require("mongoose"),
    User                    =require("./models/user"),
    seedDB                  =require("./seeds");

//seedDB();
//const PORT=process.env.PORT || 8080;
mongoose.connect("mongodb://localhost:27017/yelp_camp_3",{ useNewUrlParser: true , useUnifiedTopology: true });  
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/yelp_camp_3",{ useNewUrlParser: true , useUnifiedTopology: true });  

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs")
app.use(express.static(__dirname +'/public'));

//PASSPORT Config.
app.use(require("express-session")(
    {
        secret:"You are the best",
        resave:false,
        saveUninitialized:false
    }));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    next();
});


passport.use(new LocalPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var Campgrounds=require("./models/campground");
var Comment=require("./models/comment");


app.get("/",function(req,res){

    res.render("landing");

});

app.get("/campgrounds",function(req,res){
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

app.post("/campgrounds",function(req,res){

    var name=req.body.name;
    var image=req.body.image;
    var info=req.body.info;
    var newCampground={name:name,image:image,info:info};
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




app.get("/campgrounds/new",function(req,res){
res.render("campgrounds/new");
});



app.get("/campgrounds/:id",function(req,res){
    
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



app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
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


app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
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
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

//-----------
//Auth Routes
//-----------


//register

app.get("/register",function(req,res){
    res.render("register");
});


app.post("/register",function(req,res){
    
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
            return res.render("register");
        }

        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
});

//login




app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",
{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){
   
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
}

app.listen(3000,function(){
console.log("YelpCamp server started");
});
