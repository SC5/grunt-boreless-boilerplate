require.config({
	baseUrl: 'app',

	paths : {
		jquery: '../components/jquery/jquery.min',
		modernizr: '../components/modernizr/modernizr'
	}
});

require([], function() {
	return require.config;
});