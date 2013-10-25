require.config({
	baseUrl: 'app',

	paths : {
		text: '../components/requirejs-text/text',
		jquery: '../components/jquery/jquery.min',
		modernizr: '../components/modernizr/modernizr',
		underscore: '../components/lodash/dist/lodash.underscore',
		backbone: '../components/backbone/backbone',
		handlebars: '../components/handlebars.js/dist/handlebars',
		domReady: '../components/requirejs-domready/domReady'
	},
	
	shim: {
		'jquery': {
			exports: 'jQuery',
			init: function () {
				return this.jQuery.noConflict();
			}
		},
		'underscore': {
			exports: '_',
			init: function () {
				return this._.noConflict();
			}
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone',
			init: function (_, $) {
				return this.Backbone.noConflict();
			}
		},
		'handlebars': {
			exports: 'Handlebars'
		}
	},
	
	config: {
		'collections/tasks': {
			url: 'app/data/tasks.json'
		}
	}
});

require([], function() {
	return require.config;
});