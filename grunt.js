/*global module:false*/
module.exports = function(grunt) {
	// Bootstrap the extra tasks needed by Grunt
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-requirejs');

	// The real grunt config
	var config = {
		pkg : '<json:package.json>',
		/* Code quality related tasks */
		lint : {
			files : 'client/app/**/*.js'
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
				options : {
					baseUrl: 'client/app',
					name: 'main',
					mainConfigFile: 'client/app/main.js',
					out: 'staging/app/main.js',
					optimize: 'none'
				}
			}
		},
		less : {
			// Fill in manually afterwards to support our config style
			debug : {
				src: 'client/css/styles.less',
				dest: 'staging/css/styles.css'
			},
			release : {
				options : {
					yuicompress : true
				},
				src: 'client/css/styles.less',
				dest: 'staging/css/styles.css'
			}
		},
		// Build JS into one monolith by JamJS/RequireJS
		min : {
			dist : {
				src : 'staging/app/main.js',
				dest : 'dist/app/main.js'
			}
		},
		/* Helper tasks */
		copy : {
			debug : {
				files : {
					'staging/': 'client/*.html',
					'staging/app/': 'client/app/**/*',
					'staging/components/': 'client/components/**/*'
				}
			},
			release : {
				files : {
					'staging/': 'client/*.html',
					'staging/components/requirejs/require.js': 'client/components/requirejs/require.js',
					'dist/components/requirejs/require.js': 'staging/components/requirejs/require.js',
					'dist/': 'staging/*.html',
					'dist/css/': 'staging/css/*.css'
				}
			}
		},
		clean: {
		 all: [ 'staging', 'dist' ]
		},
		watch : {
			client : {
				files : [ 'client/app/**/*.js', 'client/css/**/*.js', 'client/*.html' ],
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

	// Task aliases
	grunt.registerTask('release', 'clean less:release requirejs:release copy:release min test');
	grunt.registerTask('debug', 'clean less:debug copy:debug test watch');
	grunt.registerTask('test', 'lint qunit');
	grunt.registerTask('default', 'release');
};
