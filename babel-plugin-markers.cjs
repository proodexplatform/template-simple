const path = require("path");

module.exports = function markerPlugin(babel) {
  const { types: t } = babel;

  const CONFIG = {
    allowedElements: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "span", "section", "textarea", "label", "input",
      "icon", "image", "linkwrapper"
    ],
    // Folders to ignore relative to src/
    excludedFolders: [
      "components/ui",
      "utility",
      "lib",
      "styles",
      "hooks",
      "context",
      "config",
      "assets",
    ]
  };

  return {
    name: "babel-plugin-markers-vite",
    visitor: {
      JSXOpeningElement(nodePath, state) {
        const filename = state.file.opts.filename;
        if (!filename) return;

        // 1. Normalize and filter paths
        const normalizedPath = filename.replace(/\\/g, "/");
        
        // Ensure we are only touching files inside src/
        if (!normalizedPath.includes("/src/")) return;

        const srcIndex = normalizedPath.indexOf("/src/");
        const relativeToSrc = normalizedPath.substring(srcIndex + 5); // path after "src/"

        // 2. Check Exclusions
        const isExcluded = CONFIG.excludedFolders.some(folder => 
          relativeToSrc.startsWith(`${folder}/`) || relativeToSrc === folder
        );
        if (isExcluded) return;

        // 3. Identify Component Name
        let name = "Unknown";
        const n = nodePath.node.name;
        if (t.isJSXIdentifier(n)) {
          name = n.name;
        } else if (t.isJSXMemberExpression(n)) {
          name = n.property.name; // e.g., 'p' in 'Styled.p'
        }

        // Case-insensitive check against allowed elements
        if (!CONFIG.allowedElements.includes(name.toLowerCase()) && !CONFIG.allowedElements.includes(name)) {
          return;
        }

        const loc = nodePath.node.loc;
        if (!loc) return;

        // 4. Encode ID (Base64) - Matches your Next.js logic
        const rawId = `${relativeToSrc}|${loc.start.line}|${loc.end.line}`;
        const encoded = Buffer.from(rawId).toString('base64').replace(/=/g, "");
        const markerValue = `${name}-${encoded}`;

        // 5. Inject/Update data-marker attribute
        const existingAttrIndex = nodePath.node.attributes.findIndex(
          a => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name) && a.name.name === "data-marker"
        );

        if (existingAttrIndex >= 0) {
          nodePath.node.attributes[existingAttrIndex].value = t.stringLiteral(markerValue);
        } else {
          nodePath.node.attributes.push(
            t.jsxAttribute(t.jsxIdentifier("data-marker"), t.stringLiteral(markerValue))
          );
        }

        // Optional: Keep terminal logging for dev visibility
        console.log(`[Babel-Vite] Marked ${name} in ${relativeToSrc}`);
      }
    }
  };
};