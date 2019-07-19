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

    });
});
