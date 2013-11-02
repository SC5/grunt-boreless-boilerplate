// Fetch all the files to be loaded by Karma; parse the actual tests
// based on '.spec.js' filter
var tests = [];
for (var file in window.__karma__.files) {
	if (window.__karma__.files.hasOwnProperty(file)) {
		/* Add all the files within app/test path with .spec.js suffix */
		if (/test\/app.+\.spec\.js$/.test(file)) {
			tests.push(file);
		}
	}
}

// Fetch the base (main) config, override by Karma specific base url.
// Then run the tests.
var baseUrl = '/base/app';
require([ baseUrl + '/config.js'], function(mainConfig) {
	require.config({
		baseUrl: baseUrl
	});

	// Start the tests
	require([].concat(tests), function() {
		window.__karma__.start();
		//console.log('Tests ran:', tests);
	});
});