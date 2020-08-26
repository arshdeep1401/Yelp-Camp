var express                 =require("express"),
    app                     =express(),
    bodyParser              =require("body-parser"),
    passport                =require("passport"),
    LocalPassport           =require("passport-local"),
    passportLocalMongoose   =require("passport-local-mongoose"),
    mongoose                =require("mongoose"),
    flash                   =require("connect-flash"),
    methodOverride          =require("method-override"),
    Campgrounds             =require("./models/campground"),
    Comment                 =require("./models/comment"),
    User                    =require("./models/user"),
    seedDB                  =require("./seeds");


    // requiring routes
    var commentRoutes       =require("./routes/comments"),
        campgroundRoutes    =require("./routes/campgrounds"),
        indexRoutes         =require("./routes/index");
        

/* 
// un-comment this part to seed(set) the website with predefined data of 3 campgrounds with comments
// this will run seeds.js

seedDB();

*/

mongoose.connect("mongodb+srv://arsh:1234@yelpcamp-wxxaz.mongodb.net/yelpcamp_v13?retryWrites=true&w=majority",
    { 
        useNewUrlParser: true ,
        useUnifiedTopology: true 

    }
)
.then(()=>{
    console.log("Mongodb connected");
});
  


//var url=process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_v10";
//mongoose.connect(url);

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs")
app.use(express.static(__dirname +'/public'));
// method override for edit & delete
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT(Used for auth) Config.
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
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});


passport.use(new LocalPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/*----------
 7 RESTFULL Routes 
-------------*/

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT || 3000,function(){
console.log("YelpCamp server started");
});
