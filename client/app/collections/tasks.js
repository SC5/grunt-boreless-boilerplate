define(['backbone', 'underscore', 'jquery', 'module'], function(Backbone, _, $, module) {
	
	return Backbone.Collection.extend({
		url: module.config().url,
		state: 'init',
		
		initialize: function() {
			// Automatically update the model state when such comes
			this.on('all', _.bind(this.handleEvent, this));
		},
		
		handleEvent: function(event) {
			switch(event) {
				case 'reset':
				case 'sort':
					this.state = 'ready';
					break;
				case 'request':
				case 'sync':
					this.state = 'pending';
					break;
				default:
					this.state = 'pending';
			}
		}
	});
});