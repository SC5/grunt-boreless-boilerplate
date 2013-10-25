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
				mainConfigFile: 'client/app/config.js',
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
				configFile: 'client/karma.conf.js',
				singleRun: true,
				browsers: ['PhantomJS']
			},
			debug: {
				reporters: ['dots', 'coverage', 'junit'],
				junitReporter: {
					// NOTE: Output file is relative to karma.conf.js
					outputFile: '../<%= defaults.debug.dir %>/test/junit/test-results.xml',
					suite: ''
				},
				coverageReporter: {
					type: 'cobertura',
					dir: '../<%= defaults.debug.dir %>/test/coverage/'
				}
			},
			release: {
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
			desktop: {
				browsers: ['Chrome'],
				singleRun: false,
			}
		},

		/* Build & Optimization steps */
		process: {
			debug: {
				src: '<%= defaults.source.dir %>/index.html',
				dest: '<%= defaults.debug.dir %>/index.html',
				context: {
					stylesheetFile: 'css/styles.less',
					stylesheetLanguage: 'stylesheet/less',
					scriptFile: 'app/main.js',
					scriptLoader: 'components/requirejs/require.js',
					// This is an extra mechanism e.g. for injecting weinre, cordova & such
					// things that we want to explicitly get to header
					scripts: [ 'components/less.js/dist/less-1.3.3.js' ]
				}
			},
			release: {
				src: '<%= defaults.source.dir %>/index.html',
				dest: 'temp/index.html',
				context: {
					stylesheetFile: 'css/styles-<%= pkg.version %>.css',
					stylesheetLanguage: 'stylesheet',
					scriptFile: 'app/main-<%= pkg.version %>.js',
					scriptLoader: 'components/requirejs/require-<%= pkg.version %>.js',
					scripts: []
				}
			}
		},
		requirejs : {
			release : {
				options: '<%= defaults.requirejs %>'
			}
		},
		less : {
			// Fill in manually afterwards to support our config style
			debug : {
				// Trick to concatenate the reset.css into the less file
				src: [ '<%= defaults.source.dir %>/components/semantic-grid/stylesheets/reset.css',
					'<%= defaults.source.dir %>/css/styles.less' ],
				dest: '<%= defaults.debug.dir %>/css/styles.css'
			},
			release : {
				options : {
					yuicompress : true
				},
				src: [ '<%= defaults.source.dir %>/components/semantic-grid/stylesheets/reset.css',
					'<%= defaults.source.dir %>/css/styles.less' ],
				dest: 'temp/css/styles-<%= pkg.version %>.css'
			},
		},
		// Build JS into one monolith by JamJS/RequireJS
		uglify : {
			release : {
				files: {
					'<%= defaults.release.dir %>/app/main-<%= pkg.version %>.js': 'temp/app/main.js',
					'<%= defaults.release.dir %>/components/requirejs/require-<%= pkg.version %>.js': '<%= defaults.source.dir %>/components/requirejs/require.js'
				}
			}
		},
		/* Helper tasks */
		copy : {
			release : {
				files : [
					/* Copy to temp directory first */
					{
						src: '*.html',
						expand: true,
						cwd: 'temp',
						dest: '<%= defaults.release.dir %>'
					},
					/* Then the real thing */
					{
						src: [ '**/*.css' ],
						expand: true,
						cwd: 'temp',
						dest: '<%= defaults.release.dir %>'
					},
					{
						src: 'app/**/*.json',
						expand: true,
						cwd: '<%= defaults.source.dir %>',
						dest: '<%= defaults.release.dir %>'
					}
				]
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
				'<%= defaults.source.dir %>/**/*.html'
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
	grunt.registerTask('release', ['clean', 'process:release', 'less:release', 'requirejs:release', 'copy:release', 'uglify', 'test:release']);
	grunt.registerTask('debug', ['clean', 'process:debug', 'less:debug', 'test:debug']);
	// NOTE: Tests starts a temporary server for static files
	grunt.registerTask('test:release', ['jshint', 'karma:release']);
	grunt.registerTask('test:debug', ['jshint', 'karma:debug']);
	grunt.registerTask('test:desktop', ['jshint', 'karma:desktop']);
	grunt.registerTask('default', ['release']);
};
