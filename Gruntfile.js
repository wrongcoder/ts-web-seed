module.exports = function (grunt) {
	"use strict";

	grunt.loadNpmTasks("grunt-bowercopy");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-compress");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-mkdir");
	grunt.loadNpmTasks("grunt-prettify");
	grunt.loadNpmTasks("grunt-targethtml");
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks("grunt-tsd");
	grunt.loadNpmTasks("grunt-webpack");

	grunt.registerTask("init", ["clean", "mkdir", "tsd", "bowercopy:dev", "bowercopy:dist"]);
	grunt.registerTask("dev", ["init", "ts:build", "connect:dev:keepalive"]);
	grunt.registerTask("dev-watch", ["init", "connect:dev", "ts:buildwatch"]);
	grunt.registerTask("dist", ["init", "ts:build", "webpack", "uglify", "copy", "targethtml", "prettify", "less", "compress"]);
	grunt.registerTask("test", ["dist", "connect:dist:keepalive"]);

	grunt.initConfig({
		clean: {
			default: ["build"],
		},
		mkdir: {
			default: {
				options: {
					create: ["build/tsc"],
				},
			},
		},
		ts: {
			options: {
				compiler: "node_modules/typescript/bin/tsc",
			},
			build: {
				tsconfig: {
					tsconfig: "src",
					passThrough: true,
				},
			},
			buildwatch: {
				tsconfig: {
					tsconfig: "src",
					passThrough: true,
				},
				watch: "src",
			},
		},
		tsd: {
			default: {
				options: {
					command: "reinstall",
					config: "tsd.json",
				},
			},
		},
		bowercopy: {
			dev: {
				options: {
					destPrefix: "build/dev-resources",
				},
				files: {
					"require1k.js": "require1k/require1k.js",
					"less.js": "less/dist/less.js",
				},
			},
			dist: {
				options: {
					destPrefix: "build/resources",
				},
				files: {
					"lodash.js": "lodash/lodash.min.js",
				},
			}
		},
		webpack: {
			dist: {
				devtool: "source-map",
				entry: "./build/tsc/app/Application",
				output: {
					path: "build/bundle",
					filename: "bundle.js",
					sourceMapFilename: "bundle.js.map",
				},
				module: {
					preLoaders: [
						{ test: /\.js$/, loader: "source-map" },
					],
				},
			},
		},
		uglify: {
			dist: {
				src: ["build/bundle/bundle.js"],
				dest: "build/bundle/bundle.min.js",
			},
			options: {
				now: new Date(),
				mangle: {
					toplevel: true,
				},
				compress: true,
				sourceMap: true,
				sourceMapIn: ["build/bundle/bundle.js.map"],
				banner: "/* \u00A9 <%= uglify.options.now.getFullYear() %> example.com */",
			},
		},
		copy: {
			dist: {
				files: [
					{
						expand: true,
						cwd: "src/",
						src: [
							"**",
							"!test/**",
							"!**/*.ts", "!*.ts",
							"!**/*.less", "!**.less",
							"!index.html",
							"!tsconfig.json",
						],
						dest: "build/dist/",
						filter: "isFile",
					},
					{ expand: true, cwd: "build/resources/", src: "**", dest: "build/dist/", filter: "isFile" },
					{ src: "build/bundle/bundle.min.js", dest: "build/dist/application.js" },
				],
			},
		},
		targethtml: {
			dist: {
				files: {
					"build/html/index.html": "src/index.html",
				},
			},
		},
		prettify: {
			dist: {
				files: [
					{ expand: true, cwd: "build/html/", src: "*.html", dest: "build/dist/", filter: "isFile" },
				],
			},
		},
		less: {
			dist: {
				files: {
					"build/dist/style.css": "src/style.less",
				},
				options: {
					strictImports: true,
					strictMath: true,
					strictUnits: true,
					cleancss: true,
				},
			},
		},
		connect: {
			options: {
				debug: true,
			},
			dev: {
				options: {
					base: ["build/tsc", "src", "build/dev-resources", "build/resources"],
				},
			},
			dist: {
				options: {
					base: "build/dist",
				},
			},
		},
		compress: {
			dist: {
				options: {
					mode: "zip",
					archive: "build/dist.zip",
				},
				files: [
					{ expand: true, cwd: "build/dist/", src: "**" },
				],
			},
		},
	});

};
