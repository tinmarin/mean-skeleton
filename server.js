var express    = require('express');		
var	bodyParser = require('body-parser'); 	
var morgan     = require('morgan'); 	
var path 	   = require('path');
var favicon    = require('serve-favicon');
var compress   = require('compression');
var config 	   = require('./server/config');
var mongoose   = require('mongoose');   

var app = express(); 

app.use(compress()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
	next();
});

app.use(morgan('dev'));

//Uncomment to connect to the database defined in the config file
//mongoose.connect(config.database);     

app.use(express.static(__dirname + '/'));

app.get('*', function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});

var apiRoutes = require('./server/routes/api')(app, express);
app.use('/api', apiRoutes);

app.listen(config.port, function() {
	console.log('Listening on port: ' + config.port);	
});