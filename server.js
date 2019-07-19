const express = require("express");
const exphbs = require("express-handlebars");
const logger = require("morgan");
const mongoose = require("mongoose");
// const article = require("./models/Article")
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
//   require("./routes/htmlRoutes")(app);

// Connect to the Mongo DB and connect
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines", { useNewUrlParser: true })
 .catch(error => {
     console.log('there was an error connecting to the database')
     console.log(process.env.MONGODB_URI);
 }); 

mongoose.connection.on('error', error => {
    console.log(error);
});


//route finds all and displays list on page with handlebars
app.get("/", (req, res) => {
    db.Article.find({}).then(data => {
        var hbsobj = {
            article: data
        }
        res.render("index", hbsobj);
    }).catch(error => {s
        res.json(error)
    })
    
});

//route finds all that are saved and displays list on page with handlebars
app.get("/saved", (req, res) => {
    db.Article.find({saved: true}).then(data => {
        var hbsobj = {
            article: data
        }
        res.render("index", hbsobj);
    })
});

//route changes article to saved
app.get("/addtosave/:id", (req, res) => {
    console.log("the id is " + req.params.id);
    db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true } }, { new: true })
    res.send("you successfully saved the article.");
});


// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    
    axios.get("https://www.cambodiadaily.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $(".item-details").each(function (i, element) {
            // Save an empty result object
            const result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).find(".entry-title").text();
            result.link = $(this).children().children().attr("href");
            result.summary = $(this).find(".td-excerpt").text();

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });

        // Send a message to the client
        //   res.send("Scrape Complete");
        console.log("scrape complete");
        res.send("everyone thing is ok");
    }).catch(error => {
        console.log("failed to reach cambodiadaily")
        res.json(error);
    });

});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
        .then(function (articles) {
            // If all Users are successfully found, send them back to the client
            res.json(articles);
        })
        .catch(function (err) {
            // If an error occurs, send the error back to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (articles) {
            // If all Users are successfully found, send them back to the client
            res.json(articles);
        })
        .catch(function (err) {
            // If an error occurs, send the error back to the client
            res.json(err);
        });


});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { note: dbNote._id } }, { new: true });
        })
        .then(function (dbUser) {
            // If the User was updated successfully, send it back to the client
            res.json(dbUser);
        })
        .catch(function (err) {
            // If an error occurs, send it back to the client
            res.json(err);
        });
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

