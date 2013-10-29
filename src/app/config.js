require.config({
	baseUrl: 'app',

	paths : {
		angular: '../components/angular/angular'
	},
	
	shim: {
		'angular': {
			exports: 'angular'
		}
	}
});

require([], function() {
	return require.config;
});