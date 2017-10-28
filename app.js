
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');

// installing mongoose module
var mongoose = require('mongoose'); 

var bodyParser = require('body-parser');

app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));

// configuring the database

var dbPath = "mongodb://localhost/myblog";

db = mongoose.connect(dbPath);

mongoose.connection.once('open',function(){
	console.log("Success! Database connection open");
});

// including the model file
// We called it Blog in our model call
var Blog = require('./blogModel.js');

// the blogModel is going to play with our Schema which we used in blogModel.js
var blogModel = mongoose.model('Blog');

// Application Middleware --> Global instance, logged everytime
app.use(function(req,res,next){

	console.log("Logging starts");
	console.log("User searched for"+ req.originalUrl);
	console.log("User's IP-Address: "+req.ip);
	console.log("Logging ends");
	next();
});

app.get('/',function (request,response){

	response.send("Hi, Welcome to Backend Development! Let's create a blog");

});


	//POST request to create a blog
app.post('/blog/create',function(req,res){

	var newBlog = new blogModel({

		title: req.body.title,
		subtitle: req.body.subtitle,
		blogBody : req.body.blogBody
	});

	newBlog.authorInfo = {name:req.body.name,age:req.body.age,email:req.body.email};

	var topics = (req.body.topics!= undefined && req.body.topics!=null ? req.body.topics.split(','):'');
   	newBlog.topics = topics ;

    // creates your blog
	newBlog.save(function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.send(newBlog);
		}
	});

});

	//GET request to find a particular blog

app.get('/blog/:blogId',function (req,res){

	blogModel.find({"_id" :req.params.blogId},function(err,result){

		if(err){
			res.send(err);
		}
		else{

			res.send(result);
		}
	});

});

	// GET request for all blogs

app.get('/allblogs',function(req,res){

	blogModel.find({},function(err,result){
		
		if(err){
			console.log(err);
			res.send(err);
		}
		else {
		console.log(result);
		res.send(result);
		}
	});
});



	//PUT request to Edit a blog

app.put('/blog/edit/:blogId',function(req,res){

	var update = req.body ;

	//Finding a blog and updating it. New:true returns the updated document

	blogModel.findOneAndUpdate({"_id": req.params.blogId},update,{new: true},function(err,result){

        if(err){
			res.send(err);
			}
			else{
			console.log(result);
			res.send(result);
			}
		
	});  // findOneAndUpdate ends

}); //PUT request ends


	// POST request to Delete a blog

app.post('/blog/delete/:blogId',function(req,res){

	var blogDelete = req.params.blogId ;
	

	blogModel.remove({_id: blogDelete},function(err,result){

		
		if(err){
			res.send(err);
		}
		else{
			res.json({Info:"Blog Deleted Successfully"});
		}

	});  //  remove blog ends

}); //POST request  ends


app.get('*',function(request,response,next){
		
	response.status = 404 ;

	//similar to next(err) i.e calling error

	next("Error in path");
});


//Error handling Middleware

app.use(function(err,req,res,next){
	console.log("Custom Error handler used");
	if(res.status == 404){
		res.send("Invalid Path. Kindly make sure your URL is right");
	}
	else{
		res.send(err);
	}
});  



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});