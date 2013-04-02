require.config({
	baseUrl: 'app',

	paths : {
		jquery: '../components/jquery/jquery.min',
		modernizr: '../components/modernizr/modernizr'
	}
});

require(['jquery', 'modernizr'], function($, modernizer) {
	// use app here
	$('#status').html('If you can read this text, your stack should be alright.');
}); 
