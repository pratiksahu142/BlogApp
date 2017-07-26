var express     = require("express"),
    methodOverride = require("method-override"),
    app         = express(),
    bodyParser  = require("body-parser"),
    expressSanitizer = require("express-sanitizer")
    mongoose    = require("mongoose");

//App config
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//Schema setup
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});


//mongoose / mode config
var Blog=mongoose.model("Blog",blogSchema);


// Blog.create({
//     title: "Test",
//     image: "https://farm1.staticflickr.com/51/142520422_6ad756ddf6.jpg",
//     body: "Hello this is test"
// })
//Restful Routes

app.get("/", function(req, res){
    res.redirect("/blogs");
});


app.get("/blogs", function(req, res){
    Blog.find({},function(err, blogs){
        if(err)
            console.log("Could not fetch blogs!");
        else
            res.render("index", {blogs: blogs});
    });

});

//New Route
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//Create Route
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err)
            res.send("new");
        else
            res.redirect("/blogs");
    });
});

//SHOW ROUTE

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err)
            res.redirect("/blogs");
        else{
            res.render("show",{blog: foundBlog});
        }

    });

});

//EDIT SINGLE BLOG ROUTE

app.get("/blogs/:id/edit", function(req, res){

    Blog.findById(req.params.id, function(err, foundBlog){
        if(err)
            res.redirect("/blogs");
        else{
            res.render("edit",{blog: foundBlog});
        }

    });
});

//UPDATE ROUTE

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err)
            res.redirect("/blogs");
        else{
            res.redirect("/blogs/"+req.params.id);
        }

    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    //destroy
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err)
            res.redirect("Unsuccessful Delete");
        else{
            res.redirect("/blogs");
        }

    });
    //redirect
});



app.listen(3000,function(){
    console.log("Server runnnig!");
});