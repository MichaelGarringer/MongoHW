//Dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose")
//For scraping
var axios = require("axios");
var cheerio = require("cheerio");

//Require Article and Note
var db = require("./models");
//Port
var PORT = 3000;
//Express initialization
var app = express();


app.use(logger("dev"));
//Make JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
//If on heroku use deployed database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);


//Scrape 
app.get("/scrape", function(req, res) {
  
    axios.get("https://www.theonion.com/").then(function(response) {
        var $ = cheerio.load(response.data);
    
        // var results = [];
        var results = {};
        $("article").each(function() {
          results.title = $(this)
            .find("h1")
            .text();
          results.link = $(this)
            .find("a")
            .attr("href");
        



        db.Article.create(results)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
      res.send("All done scraping");
    });
  });
//Getting all
  app.get("/articles", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });


  app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
// NOTE
  app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
//SERVER
  app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });