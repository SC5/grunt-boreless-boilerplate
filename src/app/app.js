define(['jquery', 'backbone', 'modernizr', 'domReady', 'router'],
	function($, Backbone, modernizer, domReady, Router) {
	var router = new Router();
	
	// Starts the application - the entry point to the app
	function start() {
		// Hookup into navigation to unnecessary reloading
		$(document).delegate('a[data-link="internal"]', 'click', function(event) {
			var a = event.currentTarget,
				path = [ a.pathname, a.query ].join('');
			router.navigate(path, { trigger: true });
			
			// Prevent default handling of the event
			return false;
		});
		
		// Start the app here
		domReady(function () {
			Backbone.history.start({ pushState: true });
		});
	}
	
	// Stops the application & cleans up the environment
	function stop() {
		$(document).undelegate('a[data-link="internal"]', 'click');
		Backbone.history.stop();
	}
	
	return {
		start: start,
		stop: stop,
		router: router
	};
});