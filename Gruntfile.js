module.exports = function (grunt) {
	"use strict";

	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-mkdir");
	grunt.loadNpmTasks("grunt-ts");

	grunt.registerTask("default", ["clean", "mkdir", "ts"]);

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
		connect: {
			options: {
				debug: true,
			},
			dev: {
				options: {
					base: ["build/tsc", "src"],
				},
			},
		},
	});

};
