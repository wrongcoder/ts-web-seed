module.exports = function (grunt) {
	"use strict";

	grunt.loadNpmTasks("grunt-bowercopy");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-mkdir");
	grunt.loadNpmTasks("grunt-ts");

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
				},
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
