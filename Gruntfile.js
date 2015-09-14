var Config = require("./s3cms_project/config.js");

module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				asi: true,
				expr: true,
				latedef: true,
				supernew: true,
				shadow: true,
				force: true,
				esnext: true
			},
			main: {
				all: ["src/**/*.js"]
			}
		},
		babel: {
			options: {
				sourceMaps : true,
				optional: [
					"minification.memberExpressionLiterals",
					"minification.propertyLiterals"
				],
				experimental: true,
				compact: true,
				resolveModuleSource: function(source, filename){
					var mappings = {
						"aws" : "lib/aws-sdk",
						"plusone" : "https://apis.google.com/js/client:plusone.js",
						"redux-thunk" : "lib/redux-thunk",
						"babel" : "lib/babel-polyfill",
						"reqwest" : "request"
					};

					if (mappings[source] === undefined)
						return source;
					else
						return mappings[source];
				},
				modules: "amd"
			},
			main: {
				files: [{
					expand: true,
					cwd: "src/",
					src: ["**/*.js", "**/*.jsx"],
					dest: "admin/js/",
					ext: ".js"
				}]
			},
			reduxthunk: {
	            files: {
	                'admin/js/lib/redux-thunk.js': 'node_modules/redux-thunk/src/index.js'
	            }
			}
		},
		less: {
			main: {
				options: {
					compress: true,
					sourceMap: true
				},
				files: {
					"admin/css/sb-admin-2.css" : "src/less/sb-admin-2.less"
				}
			}
		},
		uglify: {
			options: {
				mangle: false,
				sourceMap: true
			},
			requirejs: {
				files: {
					'admin/js/lib/require.js': ['node_modules/requirejs/require.js']
				}
			},
			babelpolyfill: {
				files: {
					'admin/js/lib/babel-polyfill.js': [Config.debug ? "node_modules/babel-config/browser-pollyfill.js" : "node_modules/babel-config/browser-pollyfill.min.js"]
				}
			}
		},
		copy: {
			options: {},
			react: {
				nonull: true,
				src: Config.debug ? "node_modules/react/dist/react-with-addons.js" : "node_modules/react/dist/react-with-addons.min.js", 
				dest: "admin/js/lib/react.js"
			},
			redux: {
				nonull: true,
				src: Config.debug ? "node_modules/redux/dist/redux.js" : "node_modules/redux/dist/redux.min.js", 
				dest: "admin/js/lib/redux.js"
			},
			awssdk: {
				nonull: true,
				src: Config.debug ? "node_modules/aws-sdk/dist/aws-sdk.js" : "node_modules/aws-sdk/dist/aws-sdk.min.js", 
				dest: "admin/js/lib/aws-sdk.js"
			},
			reqwest: {
				nonull: true,
				src: Config.debug ? "node_modules/reqwest/reqwest.js" : "node_modules/reqwest/reqwest.min.js", 
				dest: "admin/js/lib/reqwest.js"
			}
		},
		commands : {
			push: {
				cmd  : 'node bin/push.js'
			}
		},
		watch: {
			react: {
				files: ["node_modules/react/dist/react-with-addons.js", "node_modules/react/dist/react-with-addons.min.js"],
				tasks: ["copy:react", "commands:push"]
			},
			redux: {
				files: ["node_modules/redux/dist/redux.js", "node_modules/redux/dist/redux.min.js"],
				tasks: ["copy:redux", "commands:push"]
			},
			aws: {
				files: ["node_modules/aws-sdk/dist/aws-sdk.js", "node_modules/aws-sdk/dist/aws-sdk.min.js"],
				tasks: ["copy:awssdk", "commands:push"]
			},
			requirejs: {
				files: ["node_modules/requirejs/dist/require.js"],
				tasks: ["uglify:requirejs", "commands:push"]
			},
			babelpolyfill: {
				files: ["node_modules/babel-config/browser-pollyfill.js", "node_modules/babel-config/browser-pollyfill.min.js"],
				tasks: ["uglify:babelpolyfill", "commands:push"]
			},
			reqwest: {
				files: ["node_modules/reqwest/reqwest.js", "node_modules/reqwest/reqwest.min.js"],
				tasks: ["uglify:reqwest", "commands:push"]
			},
			reduxthunk: {
				files: ["node_modules/redux-thunk/src/index.js"],
				tasks: ["babel:reduxthunk", "commands:push"]
			},
			js: {
				files: ["src/**/*.js", "src/**/*.jsx"],
				tasks: ["jshint:main", "babel:main", "commands:push"]
			},
			css: {
				files: ["src/less/**/*.less"],
				tasks: ["less:main", "commands:push"]
			},
			html: {
				files: ["admin/**/*.html"],
				tasks: ["commands:push"]
			},
			config: {
				files: ["s3cms_project/config.js", "s3cms_project/permission_test.txt"],
				tasks: ["commands:push"]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-commands');

	// Default task(s).
	grunt.registerTask("default", ["jshint", "babel", "less", "uglify", "copy", "commands:push"]);
}