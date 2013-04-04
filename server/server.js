/**
 * Minimal static file web server to test drive the site
 */
var express = require('express'),
		http = require('http'),
		path = require('path'),
		url = require('url');

var app = express(),
		mode = app.get('env'),
		sourcePath = path.join(__dirname, '..', 'client');
		buildPath = path.join(__dirname,'..',
			(mode === 'production') ? 'dist' : 'staging');
		
// Poor man's node.js express mod_rewrite
function rewrite(paths, replacement) {
	// Form a regular expression of the given paths for rewriting the URLs
	var pathsRE = paths.join('|'),
			fullRE = [ '^\/(', pathsRE ,')' ].join(''),
			re = new RegExp(fullRE);
	
	return function (req, res, next) {
		var parsed = url.parse(req.url),
				original = req.url;
		
		// Rewrite urls of form /tasks/foobar
		if (parsed.pathname.match(re)) {
			// /tasks/123456
			parsed.pathname = parsed.pathname.replace(re, replacement);
			req.url = url.format(parsed);
			console.log('Rewrote', original, 'to', req.url);
		}
		next();
	}
}

app.configure(function() {
	app.set('port', process.env.PORT || 8080);
	app.use(express.logger('dev'));
	app.use(rewrite(['tasks(\/[\\d]+)?', 'resources(\/[\\d]+)' ], ''));
	
	// First serve the files from build path, in debug mode fallback to source path
	app.use(express.static(buildPath));
	if (mode !== 'production') {
		app.use(express.static(sourcePath));
	}
});

app.configure('development', function() {
	app.use(express.errorHandler());
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port', app.get('port'), 'serving files from', buildPath);
});
