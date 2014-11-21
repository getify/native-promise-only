#!/usr/bin/env node

var fs = require("fs"),
	path = require("path"),
	exec = require("child_process").exec,
	ugly = require("uglify-js"),
        files = ["header.js", "guards.js", "npo.src.js"],
        
	result
;

console.log("*** Building ***");
console.log("Minifying to npo.js.");

try {
	result = ugly.minify(files.map(function (f) {
			return path.join(__dirname,"lib",f);
		}),{
		mangle: true,
		compress: true,
		output: { comments: /^!/ }
	});

	fs.writeFileSync(
		path.join(__dirname,"npo.js"),
		result.code + "\n",
		{ encoding: "utf8" }
	);

	console.log("Complete.");
}
catch (err) {
	console.error(err);
	process.exit(1);
}
