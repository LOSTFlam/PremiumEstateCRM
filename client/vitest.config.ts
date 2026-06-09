import react from "@vitejs/plugin-react";
import { defineConfig, transformWithEsbuild } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";

const legacyJsAsJsx = {
  name: "legacy-js-as-jsx",
  enforce: "pre" as const,
  async transform(code: string, id: string) {
    if (!/\/(src|app)\/.*\.js$/.test(id)) {
      return null;
    }

    return transformWithEsbuild(code, id, {
      jsx: "automatic",
      loader: "jsx",
    });
  },
};

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    nodePolyfills({
      include: [
        "assert",
        "buffer",
        "crypto",
        "http",
        "https",
        "path",
        "process",
        "stream",
        "util",
        "zlib",
      ],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
    legacyJsAsJsx,
    react(),
  ],
  esbuild: {
    jsx: "automatic",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
  },
});
