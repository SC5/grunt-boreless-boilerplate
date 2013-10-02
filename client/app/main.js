
require.config({
	baseUrl: 'app',

	paths : {
		jquery: '../components/jquery/jquery.min',
		modernizr: '../components/modernizr/modernizr',
		// Test libraries
		chai: '../components/chai/chai',
		chaiChanges: '../components/chai-changes/chai-changes',
		chaiJQuery: '../components/chai-jquery/chai-jquery',
		sinon: '../components/sinonjs/sinon',
		chaiBackbone: '../components/chai-backbone/chai-backbone'
	}
});

require(['jquery', 'modernizr'], function($, modernizr) {
	// use app here
	$('#status').html('If you can read this text, your stack should be alright.');
});
