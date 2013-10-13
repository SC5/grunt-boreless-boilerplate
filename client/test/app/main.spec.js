define(['jquery', 'app'], function($, app) {
	// App bootstrapping tests
	describe('Application', function() {
		
		// Cleanup
		var statusText = 'This is the body text to be replaced';
		beforeEach(function() {
			$('body').html('<div id="status">' + statusText + '</div>');
		});
		
		it('replaces status text when starting', function() {
			app.start();
			
			// TODO Replace with your favourite assertion library
			if ($('#status').text().indexOf(statusText) !== -1) {
				throw new Error('Bootstrapping failed.');
			}
		});
	});
});