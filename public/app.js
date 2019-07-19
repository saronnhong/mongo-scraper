$(document).on("click", "#scrapeNow", function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    .then(data => {

      console.log(data);
    })
});


// Whenever someone clicks a p tag
// $(document).on("click", ".btn-success", function () {
//   // Empty the notes from the note section
//   // $("#notes").empty();

//   var thisId = $(this).attr("data-id");
//   console.log("thisId is " + thisId);

//   // Now make an ajax call for the Article
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   })
//     // With that done, add the note information to the page
//     .then((data) => {
//       console.log("button has been clicked")
//       console.log(data);

//     });
// });

$(document).on("click", ".save", function () {
  // Now make an ajax call for the Article
  var thisId = $(this).attr("data-id");
  alert("hit the save button");
  $.ajax({
    method: "GET",
    url: "/addtosave/" + thisId
  })
    // With that done, add the note information to the page
    .then((data) => {
      alert("you have saved an article");

    });
});

// //   // When you click the savenote button
// //   $(document).on("click", "#savenote", function() {
// //     // Grab the id associated with the article from the submit button
// //     var thisId = $(this).attr("data-id");

// //     // Run a POST request to change the note, using what's entered in the inputs
// //     $.ajax({
// //       method: "POST",
// //       url: "/articles/" + thisId,
// //       data: {
// //         // Value taken from title input
// //         title: $("#titleinput").val(),
// //         // Value taken from note textarea
// //         body: $("#bodyinput").val()
// //       }
// //     })
// //       // With that done
// //       .then((data) => {
// //         // Log the response
// //         console.log(data);
// //         // Empty the notes section
// //         $("#notes").empty();
// //       });

// //     // Also, remove the values entered in the input and textarea for note entry
// //     $("#titleinput").val("");
// //     $("#bodyinput").val("");
// //   });
