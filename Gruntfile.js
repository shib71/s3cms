
module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			all: ["src/**/*.js"],
			options: {
				asi: true,
				expr: true,
				latedef: true,
				supernew: true,
				shadow: true,
				force: true,
				esnext: true
			},
		},
		babel: {
			options: {
				sourceMaps : true,
				optional: [
					"minification.constantFolding",
					"minification.memberExpressionLiterals",
					"minification.propertyLiterals"
				],
				experimental: true,
				compact: true,
				resolveModuleSource: function(source, filename){
					switch (source){
					case "aws":
						return "lib/aws-sdk-2.1.49.min";
						break;
					case "react":
						return "lib/react-0.13.3.min";
						break;
					case "plusone":
						return "https://apis.google.com/js/client:plusone.js";
						break;
					case "redux":
						return "lib/redux-2.0.0.min";
						break;
					default:
						return source;
					}
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
		commands : {
			push: {
				cmd  : 'node bin/push.js'
			}
		},
		watch: {
			js: {
				files: ["src/**/*.js", "src/**/*.jsx"],
				tasks: ["jshint", "babel"]
			},
			css: {
				files: ["src/less/**/*.less"],
				tasks: ["less"]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-commands');

	// Default task(s).
	grunt.registerTask("default", ["jshint", "babel", "less", "commands"]);
}