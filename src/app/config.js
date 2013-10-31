require.config({
	baseUrl: 'app',

	paths : {
		jquery: '../components/jquery/jquery.min'
	}
});

require([], function() {
	return require.config;
});