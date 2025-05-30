const fs = require("fs");
const package = require("./package.json");

if (!fs.existsSync("./dist")) fs.mkdirSync("dist", { recursive: true });

let codepointIndex  = 60000;
const startingValue = 60000;

let mapping = {};

const iconFiles = fs.readdirSync("./icons");

for (let i = 0; i < iconFiles.length; i++) {
	const sanitizedName = iconFiles[i].split(".")[0];

	mapping[sanitizedName] = codepointIndex;

	codepointIndex++;
}

fs.writeFileSync(
	"./dist/mappings.json",
	JSON.stringify(mapping, null, "\t"),
	{ encoding: "utf-8" }
);



/// ------------------------------------------------------
/// GENERATING C/C++ HEADER FILES FOR USE IN SHADOW ENGINE
/// ------------------------------------------------------

let fileOutput = `// automatically generated header file
// Shadow Engine Icon Set ver ${package.fontVersion}
// ${package.url}

#ifndef SHADOW_NATIVE_AUTOGEN_ICON_SET_CODEPOINTS
#define SHADOW_NATIVE_AUTOGEN_ICON_SET_CODEPOINTS

`

fileOutput += `#define SHADOW_ICON_MAX 0x${codepointIndex.toString(16).toUpperCase()}\n`;
fileOutput += `#define SHADOW_ICON_MIN 0x${startingValue.toString(16).toUpperCase()}\n\n`;

const encoder = new TextEncoder();

for (const [name, codepoint] of Object.entries(mapping)) {
	
	const character = String.fromCodePoint(codepoint);
	const encoded = Array.from(encoder.encode(character)).map(byte => '\\x' + byte.toString(16).toLowerCase()).join('');

	fileOutput += `#define SHADOW_ICON_${name.toUpperCase().replaceAll("-", "_")} "${encoded}"\n`;
}


fileOutput += `\n#endif /* SHADOW_NATIVE_AUTOGEN_ICON_SET_CODEPOINTS */`;

fs.writeFileSync(
	"./dist/ShadowIcons.hpp",
	fileOutput,
	{ encoding: "utf-8" });




/// ------------------------------------------------------
/// GENERATING IMGUI WINDOW FOR TESTING ICONS
/// ------------------------------------------------------

let imguiFileOutput = `#include "ShadowIcons.hpp"
#include "imgui.h"

namespace Shadow::AXE {

void iconDebugDrawingDrawAllIcons() {
	ImGui::TextWrapped(
`;
for (const [name, _codepoint] of Object.entries(mapping)) {
	imguiFileOutput += `\t\tSHADOW_ICON_${name.toUpperCase().replaceAll("-", "_")}\n`;
}

imguiFileOutput += `	);
}

}`;

fs.writeFileSync(
	"./dist/AXEIconDebugDrawing.cpp",
	imguiFileOutput,
	{ encoding: "utf-8" });