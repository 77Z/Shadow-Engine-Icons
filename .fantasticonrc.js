const package = require("./package.json");
const codepoints = require("./dist/mappings.json");

module.exports = {
	name: "shadow",
	prefix: "shadow",
	inputDir: "./icons",
	outputDir: "./dist",
	fontTypes: ["ttf"],
	assetTypes: [],
	normalize: true,
	formatOptions: {
		ttf: {
			url: package.url,
			description: package.description,
			version: package.fontVersion,
		},
	},
	codepoints: codepoints,
};
