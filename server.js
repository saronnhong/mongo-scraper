const express = require("express");
const exphbs = require("express-handlebars");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

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

app.get("/saved", (req, res) => {
    db.Article.find({saved: true}).then(data => {
        var hbsobj = {
            article: data
        }
        res.render("index", hbsobj);
    })
});

app.get("/scrape", function (req, res) {
    axios.get("https://www.cambodiadaily.com/").then(function (response) {
        const $ = cheerio.load(response.data);
        $(".item-details").each(function (i, element) {
            const result = {};
            result.title = $(this).find(".entry-title").text();
            result.link = $(this).children().children().attr("href");
            result.summary = $(this).find(".td-excerpt").text();
            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        res.send("Scrape was successful");
    }).catch(error => {
        console.log("Failed to reach Cambodia Daily")
        res.json(error);
    });

});

app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (articles) {
            res.json(articles);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (articles) {
            res.json(articles);
        })
        .catch(function (err) {
            res.json(err);
        });
});


app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { note: dbNote._id, saved: true }  }, { new: true });
        })
        .then(function (dbUser) {
            res.json(dbUser);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

