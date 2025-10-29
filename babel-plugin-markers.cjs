// babel-plugin-markers.cjs (DEV / INSPECTION MODE)
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

module.exports = function markerPlugin(babel) {
  const t = babel.types;

  const CONFIG = {
    outputPath: "markers.json",
    allowedElements: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "span", "section", "textarea", "label", "input",
      "icon", "image", "linkwrapper"
    ],
    validRoots: ["src/layout/", "src/pages/"]
  };

  return {
    name: "babel-plugin-markers-dev",
    visitor: {
      Program: {
        enter(_, state) {
          state.file.metadata.markers = [];
        },
      },

      JSXOpeningElement(pathNode, state) {
        const loc = pathNode.node.loc;
        const file = state.file.opts.filename;
        if (!loc || !file) return;

        const relativeFile = path
          .relative(process.cwd(), file)
          .split(path.sep)
          .join(path.posix.sep);

        const isValidRoot = CONFIG.validRoots.some((root) =>
          relativeFile.startsWith(root)
        );
        if (!isValidRoot) return;

        let nameNode = pathNode.node.name;
        let componentName = "Unknown";

        if (t.isJSXIdentifier(nameNode)) {
          componentName = nameNode.name;
        }

        // ✅ Only mark allowed elements (case insensitive match)
        const isAllowedHtml = CONFIG.allowedElements.includes(
          componentName.toLowerCase()
        );
        if (!isAllowedHtml) return;

        const hash = crypto
          .createHash("md5")
          .update(`${relativeFile}:${loc.start.line}:${loc.start.column}`)
          .digest("hex")
          .slice(0, 8);

        const newMarker = `${componentName}-${hash}`;

        const existingAttrIndex = pathNode.node.attributes.findIndex(
          (attr) =>
            t.isJSXAttribute(attr) &&
            t.isJSXIdentifier(attr.name) &&
            attr.name.name === "data-marker"
        );

        let existingMarkers = [];
        if (existingAttrIndex >= 0) {
          const attr = pathNode.node.attributes[existingAttrIndex];
          const raw = attr.value?.value || "";
          existingMarkers = raw.split(";").map((m) => m.trim()).filter(Boolean);
        }

        if (!existingMarkers.includes(newMarker)) existingMarkers.push(newMarker);
        const merged = existingMarkers.join(";");

        if (existingAttrIndex >= 0) {
          pathNode.node.attributes[existingAttrIndex].value =
            t.stringLiteral(merged);
        } else {
          pathNode.node.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier("data-marker"),
              t.stringLiteral(merged)
            )
          );
        }

        state.file.metadata.markers.push({
          id: newMarker,
          file: relativeFile,
          start: loc.start,
          end: loc.end,
          component: componentName,
          type: "html",
        });
      },
    },

    post(state) {
      const outPath = path.resolve(process.cwd(), CONFIG.outputPath);
      let allMarkers = {};

      if (fs.existsSync(outPath)) {
        try {
          allMarkers = JSON.parse(fs.readFileSync(outPath, "utf8")) || {};
        } catch {
          allMarkers = {};
        }
      }

      const currentFile = state.opts.filename;
      const relativeFile = path
        .relative(process.cwd(), currentFile)
        .split(path.sep)
        .join(path.posix.sep);

      const markers = state.metadata.markers || [];

      if (markers.length > 0) {
        allMarkers[relativeFile] = markers;
      } else {
        delete allMarkers[relativeFile];
      }

      fs.writeFileSync(outPath, JSON.stringify(allMarkers, null, 2), "utf8");

      console.log(
        `[babel-plugin-markers] ${relativeFile}: ${markers.length} markers`
      );
    },
  };
};
