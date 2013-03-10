define(['jquery', 'backbone', 'views/tasks/tasks', 'views/task/task', 'collections/tasks', 'module'],
	function($, Backbone, TasksView, TaskView, TasksCollection, module) {
	return Backbone.Router.extend({
		selector: '#main',
		
		routes: {
			'':  'main',
			'tasks': 'tasks',
			'tasks/:id': 'task'
		},
		
		collections: {
			tasks: new TasksCollection()
		},
		
		initialize: function() {
			console.log('Initializing router');
		},
		
		main: function() {
			Backbone.history.navigate('tasks', { trigger: true, replace: true });
		},
		
		tasks: function() {
			console.log('Trigger route tasks');
			
			// Create a view with cached collection
			var collection = this.collections.tasks,
				view = new TasksView({ collection: collection });
			if (collection.state === 'init') {
				collection.fetch();
			}
			
			// Toggle the view visible
			view.render();
			$(this.selector).html(view.$el);
		},
		
		task: function(id) {
			var collection = this.collections.tasks,
				model = this.collections.tasks.get(id) || new collection.model(),
				view = new TaskView({ model: model }),
				that = this;
				
			if (collection.state === 'init') {
				collection.on('reset', function(models) {
					// Remove listener
					collection.off('reset', this);
					model = that.collections.tasks.get(id);
					// Replace the newly created model with the attributes of the view
					if (model) {
						view.model.set(model.attributes);
					}
				});
				collection.fetch();
			}
			
			// Toggle the view visible
			view.render();
			$(this.selector).html(view.$el);
		}
	});
});