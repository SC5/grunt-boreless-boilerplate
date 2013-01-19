/*global module:false*/
module.exports = function(grunt) {
	// Bootstrap the extra tasks needed by Grunt
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-requirejs');

	// The real grunt config
	var config = {
		pkg: '<json:package.json>',
		defaults: {
			source: {
				/* Note: You also need to change RequireJS paths below */
				dir: 'client'
			},
			debug: {
				dir: 'staging'
			},
			release: {
				dir: 'dist'
			},
			requirejs: {
				/* Note: We build directly from the source directory to avoid copying of libs */
				baseUrl: 'client/app',
				name: '../components/almond/almond',
				include: ['main'],
				insertRequire: ['main'],
				mainConfigFile: 'client/app/main.js',
				out: 'temp/app/amdloader.js',
				optimize: 'none'
			}
		},
		/* Code quality related tasks */
		lint : {
			files : '<%= defaults.source.dir %>/app/**/*.js'
		},
		jshint : {
			options : {
				curly : true, eqeqeq : true, immed : true, latedef : true,
				newcap : true,noarg : true, sub : true, undef : true,
				boss : true, eqnull : true, browser : true, devel : true
			},
			globals : {
				require : true,
				define : true
			}
		},
		qunit : {
			files : 'tests/*.html'
		},
		
		/* Build & Optimization steps */
		requirejs : {
			release : {
				options: '<config:defaults.requirejs>'
			}
		},
		less : {
			// Fill in manually afterwards to support our config style
			debug : {
				src: '<%= defaults.source.dir %>/css/styles.less',
				dest: '<%= defaults.debug.dir %>/css/styles.css'
			},
			release : {
				options : {
					yuicompress : true
				},
				src: '<%= defaults.source.dir %>/css/styles.less',
				dest: 'temp/css/styles.css'
			}
		},
		// Build JS into one monolith by JamJS/RequireJS
		min : {
			release : {
				src : 'temp/app/amdloader.js',
				dest : '<%= defaults.release.dir %>/app/amdloader.js'
			}
		},
		/* Helper tasks */
		copy : {
			debug : {
				files : {
					'<%= defaults.debug.dir %>/': '<%= defaults.source.dir %>/*.html',
					'<%= defaults.debug.dir %>/app/': '<%= defaults.source.dir %>/app/**/*',
					'<%= defaults.debug.dir %>/components/': '<%= defaults.source.dir %>/components/**/*',
					'<%= defaults.debug.dir %>/app/amdloader.js': '<%= defaults.source.dir %>/components/requirejs/require.js'
				}
			},
			release : {
				files : {
					'temp/': '<%= defaults.source.dir %>/*.html',
					'<%= defaults.release.dir %>/': 'temp/*.html',
					'<%= defaults.release.dir %>/css/': 'temp/css/*.css'
				}
			}
		},
		clean: {
			all: [ 'temp', '<%= defaults.debug.dir %>', '<%= defaults.release.dir %>' ]
		},
		watch : {
			client : {
				files : [
				'<%= defaults.source.dir %>/app/**/*.js',
				'<%= defaults.source.dir %>/css/**/*.less',
				'<%= defaults.source.dir %>/*.html'
				],
				tasks : 'debug'
			},
			tests : {
				files : [ 'tests/*.html' ],
				tasks : 'test'
			}
		}
	};
	
	// Project configuration.
	grunt.initConfig(config);
	
	// Define the 'external API' through task aliases; Override the defaults by platform specifics
	grunt.registerTask('release', 'clean less:release requirejs:release copy:release min test');
	grunt.registerTask('debug', 'clean less:debug copy:debug test watch');
	grunt.registerTask('test', 'lint qunit');
	grunt.registerTask('default', 'release');
};
