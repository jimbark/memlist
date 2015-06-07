module.exports = function(grunt){

        // load plugins
        [
                'grunt-cafe-mocha',
                'grunt-contrib-jshint',
                'grunt-exec',
	        'grunt-contrib-less',
                'grunt-contrib-uglify',
                'grunt-contrib-cssmin',
                'grunt-hashres',
	        'grunt-lint-pattern',
        ].forEach(function(task){
                grunt.loadNpmTasks(task);
        });

        // configure plugins
        grunt.initConfig({
                cafemocha: {
                        all: { src: 'qa/tests-*.js', options: { ui: 'tdd' }, }
                },
                jshint: {
                        app: ['memlist.js', 'public/js/**/*.js',
                                'lib/**/*.js'],
                        qa: ['Gruntfile.js', 'public/qa/**/*.js', 'qa/**/*.js'],
                },
                exec: {
                        linkchecker:
                                { cmd: 'linkchecker http://localhost:3000' }
                },
	        less: {
		    development: {
			options: {
			    customFunctions: {
				static: function(lessObject, name) {
				    return 'url("' +
					require('./lib/static.js').map(name.value) +
					'")';
				}
			    }
			},
			files: {
			    'public/css/main-custom.css': 'less/main-custom.less',
			}
		    }
		},
	        uglify: {
		    all: {
			files: {
			    'public/js/memlist.min.js': ['public/js/**/*.js']
			}
		    }
		},
                cssmin: {
		    combine: {
			files: {
			    'public/css/memlist.css': ['public/css/**/*.css',
							  '!public/css/memlist*.css']
			}
		    },
		    minify: {
			src: 'public/css/memlist.css',
			dest: 'public/css/memlist.min.css',
		    }
		},
                hashres: {
		    options: {
			fileNameFormat: '${name}.${hash}.${ext}'
		    },
		    all: {
			src: [
			    'public/js/memlist.min.js',
			    'public/css/memlist.min.css',
			],
			dest: [
			    'views/layouts/main.handlebars',
			]
		    },
		},
	        lint_pattern: {
		    view_statics: {
			options: {
			    rules: [
				{
				    pattern: /<link [^>]*href=["'](?!\{\{static )/,
				    message: 'Un-mapped static resource found in <link>.'
				},
				{
				    pattern: /<script [^>]*src=["'](?!\{\{static )/,
				    message: 'Un-mapped static resource found in <script>.'
				},
				{
				    pattern: /<img [^>]*src=["'](?!\{\{static )/,
				    message: 'Un-mapped static resource found in <img>.'
				},
			    ]
			},
			files: {
			    src: [
				'views/**/*.handlebars'
			    ]
			}
		    },
		    css_statics: {
			options: {
			    rules: [
				{
				    pattern: /url\(/,
				    message: 'Un-mapped static found in LESS property.'
				},
			    ]
			},
			files: {
			    src: [
				'less/**/*.less'
			    ]
			}
		    }
		}
        });

        // register tasks
        grunt.registerTask('default', ['cafemocha','jshint','exec']);
        grunt.registerTask('static', ['less', 'cssmin', 'uglify', 'hashres']);
};
