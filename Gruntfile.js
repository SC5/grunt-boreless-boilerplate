/*global module:false*/
module.exports = function(grunt) {
	// Bootstrap the extra tasks needed by Grunt
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');

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
				mainConfigFile: 'client/app/main.js',
				dir: 'temp/app',
				optimize: 'none',
				keepBuildDir: false,
				paths: {
				},
				modules: [{ name: 'main' }]
			}
		},
		/* Code quality related tasks */
		jshint : {
			files : {
				src: '<%= defaults.source.dir %>/app/**/*.js'
			},
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
		qunit : {
			files : 'tests/*.html'
		},
		
		/* Build & Optimization steps */
		requirejs : {
			release : {
				options: '<%= defaults.requirejs %>'
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
		uglify : {
			release : {
				files: {
					'<%= defaults.release.dir %>/app/main.js': 'temp/app/main.js',
					'<%= defaults.release.dir %>/components/requirejs/require.js': '<%= defaults.source.dir %>/components/requirejs/require.js'
				}
			}
		},
		/* Helper tasks */
		copy : {
			debug : {
				files : [ 
					{
						src: '*.html',
						expand: true,
						cwd: '<%= defaults.source.dir %>',
						dest: '<%= defaults.debug.dir %>'
					},
					{
						src: 'app/**/*',
						expand: true,
						cwd: '<%= defaults.source.dir %>',
						dest: '<%= defaults.debug.dir %>'
					},
					{
						src: 'components/**/*',
						expand: true,
						cwd: '<%= defaults.source.dir %>',
						dest: '<%= defaults.debug.dir %>'
					}
				]
			},
			release : {
				files : [
					/* Copy to temp directory first */
					{
						src: '*.html',
						expand: true,
						cwd: '<%= defaults.source.dir %>',
						dest: '<%= defaults.release.dir %>'
					},
					/* Then the real thing */
					{
						src: [ '**/*.css' ],
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
	grunt.registerTask('release', ['clean', 'less:release', 'requirejs:release', 'copy:release', 'uglify', 'test']);
	grunt.registerTask('debug', ['clean', 'less:debug', 'copy:debug', 'test', 'watch']);
	grunt.registerTask('test', ['jshint'/*, 'qunit'*/]);
	grunt.registerTask('default', ['release']);
};
