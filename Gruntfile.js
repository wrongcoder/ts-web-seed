module.exports = function (grunt) {
	"use strict";

	grunt.loadNpmTasks("grunt-bowercopy");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-mkdir");
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks("grunt-webpack");

	grunt.registerTask("default", ["clean", "mkdir", "ts", "bowercopy", "connect:dev:keepalive"]);

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
			default: {
				tsconfig: {
					tsconfig: "src",
					passThrough: true,
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
		connect: {
			options: {
				debug: true,
			},
			dev: {
				options: {
					base: ["build/tsc", "src", "build/dev-resources"],
				},
			},
		},
	});

};
