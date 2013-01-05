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
					name: '../components/almond/almond',
					include: ['main'],
					insertRequire: ['main'],
					mainConfigFile: 'client/app/main.js',
					out: 'staging/app/amdloader.js',
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
			release : {
				src : 'staging/app/amdloader.js',
				dest : 'dist/app/amdloader.js'
			}
		},
		/* Helper tasks */
		copy : {
			debug : {
				files : {
					'staging/': 'client/*.html',
					'staging/app/': 'client/app/**/*',
					'staging/components/': 'client/components/**/*',
					'staging/app/amdloader.js': 'client/components/requirejs/require.js'
				}
			},
			release : {
				files : {
					'staging/': 'client/*.html',
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
				files : [ 'client/app/**/*.js', 'client/css/**/*.less', 'client/*.html' ],
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
