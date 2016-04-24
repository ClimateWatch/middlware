
var express = require('express'),
    // _ = require('underscore')
  app = express()

  // views and templating engine
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  // serve static files
  app.use(express.static(__dirname + '/app'))
    // var bodyParser = require('body-parser')
    // app.use(bodyParser.json())
    // app.use(require('./middlewares/users'))
    // app.use(require('./controllers'));
var mongoose = require('mongoose');


/**
 * Routes
 */

// Home page
app.get('/', function(req, res) {
    res.render('index', {
        // user: req.user
    });
});

mongoose.connect('mongodb://localhost/aircheck');
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     // we're connected!
//     console.log('were connected!');
// });



// set up the RESTful API, handler methods are defined in api.js
var api = require('./controllers/api.js');
app.post('./thread', api.post);
app.get('./thread/:title.:format?', api.show);
app.get('./thread', api.list);


// Start server
app.listen(5000, function() {
    console.log('Listening on port 5000...');
})
