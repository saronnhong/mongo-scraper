// const db = require("../models");
// const article = require("../models/Article.js")


// module.exports = app => {
//     // var hbsobj={};
//     // app.get("/", (req, res) => {
//     //     db.Article.find({}).then(data => {
//     //         hbsobj = {
//     //             article: data
//     //         }
//     //     })
//     //     res.render("index", hbsobj);
//     // });

//     app.get("/scrape", function (req, res) {
//         // First, we grab the body of the html with axios
//         axios.get("https://www.cambodiadaily.com/").then(function (response) {
//             // Then, we load that into cheerio and save it to $ for a shorthand selector
//             const $ = cheerio.load(response.data);
    
//             // Now, we grab every h2 within an article tag, and do the following:
//             $(".item-details").each(function (i, element) {
//                 // Save an empty result object
//                 const result = {};
    
//                 // Add the text and href of every link, and save them as properties of the result object
//                 result.title = $(this).find(".entry-title").text();
//                 result.link = $(this).children().children().attr("href");
//                 result.summary = $(this).find(".td-excerpt").text();
    
//                 // Create a new Article using the `result` object built from scraping
//                 db.Article.create(result)
//                     .then(function (dbArticle) {
//                         // View the added result in the console
//                         // console.log(dbArticle);
//                     })
//                     .catch(function (err) {
//                         // If an error occurred, log it
//                         console.log(err);
//                     });
//             });
    
//             // Send a message to the client
//             //   res.send("Scrape Complete");
//             console.log("scrape complete");
//         });
//     });
//     // app.get("*", (req, res) => res.render("404"));
// }

