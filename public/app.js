 //button to scrape new articles
 $("#scraper").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).done(function(data) {
        console.log(data)
        window.location = "/"
    });
  });
$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#articles").prepend("<h3 data-id='" + data[i]._id + "'>" +  data[i].title  + "</h3>"+ "<a href="+ data[i].link +">Link</a>");
    
    
    }
  });

  $(document).on("click", "h3", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      .then(function(data) {
        console.log(data);
        $("#notes").append("<h4>" + data.title + "</h4>");
        $("#notes").append("<input id='titleinput' name='title' >" + "</br>");      
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button class='btn btn-dark' data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        if (data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  $(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),  
        body: $("#bodyinput").val()
      }
    })
      .then(function(data) {
        console.log(data);
        $("#notes").empty();
      });
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });