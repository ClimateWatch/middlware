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


/**
 * Routes 
 */

// Home page
app.get('/', function(req, res) {
    res.render('index', {
        // user: req.user
    });
});




// Start server
app.listen(5000, function() {
    console.log('Listening on port 5000...');
})



