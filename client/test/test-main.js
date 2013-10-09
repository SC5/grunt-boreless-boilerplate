var tests = Object.keys(window.__karma__.files).filter(function (file) {
	return (/.spec\.js$/).test(file);
});

require([].concat(tests),
	function() {
	// Run the tests
	window.__karma__.start();
});