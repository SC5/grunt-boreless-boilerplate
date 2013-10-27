define(['backbone', 'underscore', 'views/tasks/tasks'],
	function(Backbone, _, TasksView) {

	// App bootstrapping tests
	describe('TasksView', function() {
		var view, stubModels, stubCollection;
		
		beforeEach(function() {
			stubModels = [{ path: 'foo', title: 'foo model' }];
			stubCollection = new Backbone.Collection(stubModels);
			view = new TasksView({ collection: stubCollection });
		});

		afterEach(function() {
			view.remove();
		});
		
		it('should render all the models of the collection', function() {
			view.render();
			_.each(stubModels, function(model) {
				expect(view.$('ul li a:contains("' + model.title + '")')).to.exist;
				expect(view.$('ul li a[href="' + model.path + '"]')).to.exist;
			});
		});

		it('should not break on special characters', function() {
			var attack = '<script>console.log("this might be dangerous!")</script>';
			view.collection = new Backbone.Collection([{ path: attack, title: attack }]);
			view.render();
			expect(view.$('script')).to.not.exist;
		});

		// FIXME Somehow handle the async calls
		/*it('should render when the bound collection changes', function(done) {
			view.should.call('render').when(function() {
				stubCollection.reset(stubModels);
			});
		});*/
	});
});