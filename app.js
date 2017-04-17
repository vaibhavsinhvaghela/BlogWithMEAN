var express=require("express");
var app=express();
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var methodOverride=require("method-override");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost/Blog");

var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    date:{
        type:Date,
        default: Date.now
    }
})

var Blog=mongoose.model("Blog",blogSchema);

app.get("/",function(req,res){
    res.redirect("/blogs");
})

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("Error has occured : " + err);
        }else{
               res.render("index",{blogs:blogs});
        }
    });
})

app.get("/blogs/new",function(req,res){
   res.render("new");
})

app.post("/blogs",function(req,res){
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            console.log("Error has occured : " + err);
        }else{
            res.redirect("/blogs");
        }
    })
})

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        }else{
               res.render("show",{blog:foundBlog});
        }
    })
})

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        }else{
            res.render("edit",{blog:foundBlog});
        }
    })
})

app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,blog){
       if(err){
           console.log(err);
       } else{
           res.redirect("/blogs/"+req.params.id);
       }
    });
})

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err,removed){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    })
})

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server started . . . ");
})

