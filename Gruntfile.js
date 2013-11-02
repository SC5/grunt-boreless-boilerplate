/*global module:false*/
/*global process:false*/
module.exports = function(grunt) {
	// Bootstrap the extra tasks needed by Grunt
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-concurrent');

	// Small-scale utility for processing templates
	grunt.registerMultiTask('process', 'Process templates.', function() {
		var data = this.data;
		var context = data.context;
		var src = grunt.template.process(data.src);
		var dest = grunt.template.process(data.dest);
		// Read file
		var input = grunt.file.read(src);
		// Process it
		var output = grunt.template.process(input, { data: context });
		// And write to a file
		grunt.file.write(dest, output);
		
		// Fail task if errors were logged.
		if (this.errorCount) { return false; }
	
		// Otherwise, print a success message.
		grunt.log.writeln('File "' + dest + '" processed.');
	});

	// The real grunt config
	var config = {
		pkg: grunt.file.readJSON('package.json'),
		defaults: {
			source: {
				/* Note: You also need to change RequireJS paths below */
				dir: 'src'
			},
			debug: {
				dir: 'staging'
			},
			release: {
				dir: 'dist'
			},
			requirejs: {
				/* Note: We build directly from the source directory to avoid copying of libs */
				baseUrl: 'src/app',
				mainConfigFile: 'src/app/config.js',
				dir: 'temp/app',
				optimize: 'none',
				keepBuildDir: false,
				paths: {
				},
				modules: [{ name: 'main' }]
			}
		},
		/* Code quality related tasks */
		jshint: {
			files: [
					'<%= defaults.source.dir %>/app/**/*.js',
					'*.js'
			],
			options : {
				curly : true, eqeqeq : true, immed : true, latedef : true,
				newcap : true,noarg : true, sub : true, undef : true,
				boss : true, eqnull : true, browser : true, devel : true,
				globals : {
					require : true,
					define : true
				}
			}
		},
		karma: {
			options: {
				configFile: 'src/karma.conf.js',
				singleRun: true,
				browsers: ['PhantomJS']
			},
			debug: {
				reporters: ['dots']
			},
			release: {
				captureTimeout: 15000,
				reporters: ['dots', 'coverage', 'junit'],
				junitReporter: {
					// NOTE: Output file is relative to karma.conf.js
					outputFile: '../<%= defaults.release.dir %>/test/junit/test-results.xml',
					suite: ''
				},
				coverageReporter: {
					type: 'cobertura',
					dir: '../<%= defaults.release.dir %>/test/coverage/'
				}
			},
			watch: {
				browsers: ['Chrome'],
				singleRun: false,
				autoWatch: true,
				reporters: ['dots'],
				htmlReporter: {
					outputFile: '../<%= defaults.debug.dir %>/test/units.html',
				}
			}
		},

		/* Build & Optimization steps */
		process: {
			debug: {
				src: '<%= defaults.source.dir %>/index.html',
				dest: '<%= defaults.debug.dir %>/index.html',
				context: {
					stylesheetFile: 'css/styles.css',
					stylesheetLanguage: 'stylesheet',
					scriptFile: 'app/main.js',
					scriptLoader: 'components/requirejs/require.js',
					// This is an extra mechanism e.g. for injecting weinre, cordova & such
					// things that we want to explicitly get to header
					scripts: [
						/* Live reload triggered by grunt watch */
						'//localhost:35729/livereload.js'
					]
				}
			},
			release: {
				src: '<%= defaults.source.dir %>/index.html',
				dest: '<%= defaults.release.dir %>/index.html',
				context: {
					stylesheetFile: 'css/styles-<%= pkg.version %>.css',
					stylesheetLanguage: 'stylesheet',
					scriptFile: 'app/main-<%= pkg.version %>.js',
					scriptLoader: 'components/requirejs/require-<%= pkg.version %>.js',
					scripts: []
				}
			}
		},
		requirejs: {
			release: {
				options: '<%= defaults.requirejs %>'
			}
		},
		less: {
			release: {
				options: {
					yuicompress: true
				},
				src: '<%= defaults.source.dir %>/css/styles.less',
				dest: '<%= defaults.release.dir %>/css/styles-<%= pkg.version %>.css'
			},
			debug: {
				options: {
					yuicompress: false
				},
				src: '<%= defaults.source.dir %>/css/styles.less',
				dest: '<%= defaults.debug.dir %>/css/styles.css'
			}

		},
		// Build JS into one monolith by JamJS/RequireJS
		uglify : {
			release: {
				files: {
					'<%= defaults.release.dir %>/app/main-<%= pkg.version %>.js': 'temp/app/main.js',
					'<%= defaults.release.dir %>/components/requirejs/require-<%= pkg.version %>.js': '<%= defaults.source.dir %>/components/requirejs/require.js'
				}
			}
		},
		/* Helper tasks */
		copy: {
			release: {
				files: [
					/* Copy to temp directory first */
					{
						src: '*.html',
						expand: true,
						cwd: 'temp',
						dest: '<%= defaults.release.dir %>'
					}
				]
			}
		},
		clean: {
			all: [ 'temp', '<%= defaults.debug.dir %>', '<%= defaults.release.dir %>' ]
		},
		watch: {
			options: {
				livereload: true
			},
			client: {
				files: [
				'<%= defaults.source.dir %>/app/**/*.js',
				'<%= defaults.source.dir %>/css/**/*.less',
				'<%= defaults.source.dir %>/*.html'
				],
				tasks : 'debug'
			},
			tests: {
				files: [ '<%= defaults.source.dir %>/test/**/*.js' ],
				tasks: 'test:debug'
			},
			watch: {
				files: [
				'<%= defaults.source.dir %>/app/**/*.js',
				'<%= defaults.source.dir %>/css/**/*.less',
				'<%= defaults.source.dir %>/*.html',
				'<%= defaults.source.dir %>/test/**/*.js'
				],
				tasks: ['concurrent:debug']
			}
		},
		concurrent: {
			release: ['process:release', 'less:release', 'pipeline:javascript:release', 'copy:release'],
			debug: ['process:debug', 'less:debug'],
			watch: {
				tasks: ['watch:watch', 'jshint', 'karma:watch'],
				options: {
					logConcurrentOutput: true
				}
			},
			testRelease: ['jshint', 'karma:release'],
			testDebug: ['jshint', 'karma:debug']
		}
	};

	// Project configuration.
	grunt.initConfig(config);

	// Define the 'external API' through task aliases; Override the defaults by platform specifics
	grunt.registerTask('release', ['clean', 'concurrent:release', 'concurrent:testRelease']);
	grunt.registerTask('debug', ['clean', 'concurrent:debug', 'concurrent:testDebug']);
	grunt.registerTask('monitor', ['debug', 'concurrent:watch']);
	// NOTE: Tests starts a temporary server for static files
	grunt.registerTask('pipeline:javascript:release', ['requirejs:release', 'uglify']);
	grunt.registerTask('test:release', ['concurrent:testRelease']);
	grunt.registerTask('test:debug', ['concurrent:testDebug']);
	grunt.registerTask('test:watch', ['concurrent:testWatch']);
	grunt.registerTask('default', ['release']);
};
