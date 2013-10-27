define(['backbone', 'underscore', 'collections/tasks'],
	function(Backbone, _, TasksCollection) {

	// App bootstrapping tests
	describe('TasksCollection', function() {
		var view, stubModels, stubCollection;
		
		beforeEach(function() {
			stubModels = [{ path: 'foo', title: 'foo model' }];
			stubCollection = new TasksCollection(stubModels);
		});

		afterEach(function() {
		});
		
		it('should trigger changes when adding models', function() {
			stubCollection.should.trigger("add").when(function() {
				stubCollection.add(stubModels);
			});
		});
	});
});