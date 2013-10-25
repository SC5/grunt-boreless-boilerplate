define(['chai', 'jquery', 'backbone', 'router'],
	function(chai, $, Backbone, Router) {
	var router;

	beforeEach(function() {
		router = new Router();
	});

	// App bootstrapping tests
	describe('Router', function() {
		// TODO Check app bootstrapping
		it('routes to the right paths', function() {
			''.should.route.to(router, 'main');
			'tasks'.should.route.to(router, 'tasks');
			'tasks/1'.should.route.to(router, 'task', { arguments: ['1'] });
		});
		
		it('routes wrong routes to main', function() {
			'foobar'.should.route.to(router, 'main');
		});
	});
});