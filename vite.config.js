import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ["defaults", "not IE 11"], // Keep targeting modern browsers
    }),
  ],
  optimizeDeps: {
    include: ["redux-thunk"], // Pre-bundling redux-thunk for speed
  },
  build: {
    outDir: "dist", // Build output directory
    sourcemap: false, // Disable sourcemaps for smaller build size
    target: "esnext", // Ensure builds target modern JS for better performance
    rollupOptions: {
      input: "index.html", // Entry file
    },
    chunkSizeWarningLimit: 1000, // Increase chunk size limit to suppress warnings
  },
  server: {
    port: 3000, // Specify a custom port for local development
    open: true, // Automatically open in the browser
  },
});
