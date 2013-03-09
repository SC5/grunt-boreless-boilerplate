require.config({
	baseUrl: 'app',
	shim : {
		'ga': {
			init: function() {
				var _gaq = window._gaq || [];
				_gaq.push(['_setAccount', 'UA-XXXXX-X'], ['_trackPageview']);
				window._gaq = _gaq;
				return _gaq;
			},
			exports: '_gaq'
		}
	},

	paths : {
		jquery: '../components/jquery/jquery.min',
		modernizr: '../components/modernizer/modernizr'
	}
});

require(['jquery', 'modernizr'], function($, modernizer) {
	// use app here
	$('#status').html('If you can read this text, your stack should be alright.');
}); 