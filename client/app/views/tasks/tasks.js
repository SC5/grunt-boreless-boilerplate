define(['backbone', 'underscore', 'handlebars', 'text!./tasks.html', 'module'],
	function(Backbone, _, Handlebars, template, module) {	
	return Backbone.View.extend({
		template: Handlebars.compile(template),
		
		initialize: function() {
			// Bind to the collection that must have been given as an init parameter
			console.log('Bind event handlers');
			this.collection.on({
				'sync': _.bind(this.render, this)
			});
						
			return this;
		},
		
		render: function() {
			// Render the template into a HTML
			// TODO This is slow and can be optimized
			var context = { title: 'To do:', models: this.collection.toJSON() },
				html = this.template(context);
			
			// Replace the element contents
			this.$el.html(html);
			
			return this;
		}
	});
});