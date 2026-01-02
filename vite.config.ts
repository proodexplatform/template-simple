import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // Changed from -swc to standard react
import babel from "vite-plugin-babel";

export default defineConfig(() => ({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    // 1. Standard React plugin (uses Babel internally)
    react(),
    
    // 2. Your custom Babel transformation
    babel({
      filter: (id) =>
        /src\/.*\.[jt]sx?$/.test(id) &&
        !/node_modules/.test(id),
      babelConfig: {
        presets: [
          ["@babel/preset-react", { runtime: "automatic" }],
          "@babel/preset-typescript",
        ],
        plugins: [
          [path.resolve(__dirname, "babel-plugin-markers.cjs")],
        ],
      },
    }),
  ],
}));