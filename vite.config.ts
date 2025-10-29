import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import babel from "vite-plugin-babel";

export default defineConfig(() => ({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    watch: {
      ignored: ["**/markers.json", "**/.markers/**"],
    },
  },
  plugins: [
    react(),
    babel({
      // ✅ Only apply Babel plugin to JS/TSX files in src,
      // excluding node_modules and src/components
      filter: (id) =>
        /src\/.*\.[jt]sx?$/.test(id) &&
        !/src\/components\//.test(id) &&
        !/node_modules\//.test(id),

      babelConfig: {
        presets: [
          ["@babel/preset-react", { runtime: "automatic" }],
          "@babel/preset-typescript",
        ],
        plugins: [
          [
            path.resolve(__dirname, "babel-plugin-markers.cjs"),
          ],
        ],
      },
    }),
  ],
}));