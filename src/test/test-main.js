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
		baseUrl: baseUrl,
		
		paths: {
			chai: '../components/chai/chai',
			chaiChanges: '../components/chai-changes/chai-changes',
			chaiJQuery: '../components/chai-jquery/chai-jquery',
			sinon: '../components/sinonjs/sinon',
			chaiBackbone: '../components/chai-backbone/chai-backbone'
			// Debug configuration (can be overriden in the build)
		},
		
		shim: {
			'sinon': {
				exports: 'sinon'
			}
		},

		config: {
			'collections/tasks': {
				url: baseUrl + '/data/tasks.json'
			}
		}
	});

	// Start the tests
	require(['chai', 'chaiChanges', 'chaiJQuery', 'sinon', 'backbone',
		'chaiBackbone'].concat(tests),
		function(chai, chaiChanges, chaiJQuery, sinon, Backbone, chaiBackbone) {
		// Configure chai to use the extra modules
		chai.use(chaiChanges);
		chai.use(chaiJQuery);
		chai.use(chaiBackbone);
		
		var should = chai.should(),
			expect = chai.expect;
		
		global.Backbone = Backbone;
		global.expect = chai.expect;
		global.sinon = sinon;
		
		window.__karma__.start();
		//console.log('Tests ran:', tests);
	});
});