import react from "@vitejs/plugin-react";
import { defineConfig, transformWithEsbuild } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Dynamically import the ESM-only plugin
async function getNodePolyfills() {
  const { nodePolyfills } = await import("vite-plugin-node-polyfills");
  return nodePolyfills;
}

const legacyJsAsJsx = {
  name: "legacy-js-as-jsx",
  enforce: "pre" as const,
  async transform(code: string, id: string) {
    if (!/\/src\/.*\.js$/.test(id)) {
      return null;
    }

    return transformWithEsbuild(code, id, {
      jsx: "automatic",
      loader: "jsx",
    });
  },
};

export default defineConfig(async () => {
  const nodePolyfillsPlugin = await getNodePolyfills();
  
  return {
    plugins: [
      tsconfigPaths(),
      nodePolyfillsPlugin({
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
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
    server: {
      host: "0.0.0.0",
      port: 3000,
      proxy: {
        "/api": {
          target: process.env.VITE_API_PROXY_TARGET || "http://127.0.0.1:5001",
          changeOrigin: true,
          ws: true,
        },
      },
    },
    preview: {
      host: "0.0.0.0",
      port: 3000,
    },
    build: {
      chunkSizeWarningLimit: 2000,
      minify: "esbuild",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) {
              return undefined;
            }

            // Lazy load PDF
            if (
              id.includes("@react-pdf") ||
              id.includes("html2pdf") ||
              id.includes("jspdf") ||
              id.includes("jspdf-autotable") ||
              id.includes("html2canvas")
            ) {
              return "vendor-pdf";
            }

            // Lazy load Excel
            if (id.includes("exceljs") || id.includes("xlsx")) {
              return "vendor-excel";
            }

            // Lazy load Charts
            if (id.includes("apexcharts") || id.includes("react-apexcharts")) {
              return "vendor-charts";
            }

            return undefined;
          },
        },
      },
    },
  };
});