/**
 * Minimal static file web server to test drive the site
 */
var express = require('express'),
		http = require('http'),
		path = require('path');

var app = express(),
		mode = app.get('env') === 'development' ? 'staging' : 'dist',
		filePath = path.join(__dirname, '..', mode);

app.configure(function() {
	app.set('port', process.env.PORT || 8080);
	app.use(express.logger('dev'));
	app.use(express.static(filePath));
});

app.configure('development', function() {
	app.use(express.errorHandler());
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port', app.get('port'), 'serving files from', filePath);
});
