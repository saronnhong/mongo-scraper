$(document).on("click", "#scrapeNow", function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    .then(data => {
      console.log(data);
    })
});

$(document).on("click", ".save", function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId
  })
    .then((data) => {
      console.log("Article has been saved.")
      location.reload();
    });
});

$(document).on("click", ".deleteButton", function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/unsave/" + thisId
  })
    .then((res) => {
      console.log("Article has been unsaved.")
      location.reload();

    });
});
// add later for notes
// $(document).on("click", "#saveNoteButton", function() {
//   // Grab the id associated with the article from the submit button
//   var thisId = $(this).attr("data-id");
// alert("this has been clicked");
//   // Run a POST request to change the note, using what's entered in the inputs
//   $.ajax({
//     method: "POST",
//     url: "/article/" + thisId,
//     data: {
//       // Value taken from title input
//       title: $("#titleMessage").val(),
//       // Value taken from note textarea
//       body: $("#bodyInput").val(),
//       summary: $("#message-text").val()
//     }
//   })
//     // With that done
//     .then(function(data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       $("#notes").empty();
//     });

//   // Also, remove the values entered in the input and textarea for note entry
//   $("#titleinput").val("");
//   $("#bodyinput").val("");
// });
