define(['angular'], function(angular) {
	angular.module('BoReLESS-Angular', []);
	
	function start() {
		// Start the app here
		angular.bootstrap(document, ['BoReLESS-Angular']);
	}
	
	return {
		start: start
	};
});