var express = require("express"),
  request = require("request"),
  bodyParser = require("body-parser"),
  path = require('path'),
  methodOverride = require("method-override");

var app = express();

// list of movies and their imdbID's: {id: movie_title}
listOfMovies = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded());
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.render('index.ejs');
});

app.get('/results', function(req, res){
  var query = req.query.searchTerm;
  var url = "http://www.omdbapi.com/?s=" + query;
  request(url, function(error, response, body) {
    if (!error) {
      var data = JSON.parse(body);
      res.render("results.ejs", {movieList: data.Search || []});
    } else {
      res.send("error occured");
    }
  })
});

app.get('/details', function(req, res){
  var movieID = req.query.i;
  var url = "http://www.omdbapi.com/?i=" + movieID;
  request(url, function(error, response, body) {
    if (!error) {
      var data = JSON.parse(body);
      res.render("details.ejs", {movieDetails: data || {}});
    } else {
      res.send("error occured");
    }
  })
});

app.post('/watch', function(req, res){
  var movieTitle = req.body.Title;
  var movieIMDBID = req.body.imdbID;
  listOfMovies.push({title: movieTitle, imdbID: movieIMDBID});
  console.log(listOfMovies);
  res.redirect('/watch');
});

app.delete("/watch/:id", function(req, res) {
  var id = req.params.id;
  var movieIndex;
  listOfMovies.forEach(function(movie, index) {
    if (movie.imdbID === id) {
      movieIndex = index;
    }
  })
  listOfMovies.splice(movieIndex, 1);
  res.redirect("/watch")
})

// // app.post('/watch', function(req, res) {
// //   console.log(req.body);
// //   var movie = JSON.parse(body);
// //   movieWatch.push(movie);
// //   res.redirect('/results');
// // })

app.get('/details', function(req, res) {
  res.render("details")
})

app.get('/watch', function(req, res) {
  res.render("watch");
})

app.listen(3000);
