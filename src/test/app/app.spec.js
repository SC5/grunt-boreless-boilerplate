define(['backbone', 'app'], function(Backbone, app) {
	// App bootstrapping tests
	describe('Application', function() {
		// HTML Body
		var body = '<a data-link="internal" href="/">Test Link</a>';
		
		// Cleanup
		beforeEach(function() {
			$('body').html(body);
			app.start();
		});
		
		afterEach(function() {
			app.stop();
		});
		
		it('should have the proper interface', function() {
			expect(app.router).to.be.a('object');
			expect(app.start).to.be.a('function');
			expect(app.stop).to.be.a('function');
		});
		
		/*it('should navigate native clicks to the router', function() {
			app.router.should.trigger('route').when(function() {
				console.log('Trigger click');
				Backbone.history.navigate('/', { trigger: true });
				$('a[data-link=internal]').trigger('click');
			});
		});*/
	});
});