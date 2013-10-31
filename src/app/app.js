define(['jquery'], function($, modernizr) {
	function start() {
		// Start the app here
		$('#status').html('If you can read this text, your stack should be alright.');
	}
	
	return {
		start: start
	};
});