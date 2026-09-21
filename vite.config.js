import { defineConfig } from "vite";

export default defineConfig({
  // Relative asset paths -> works on GitHub Pages under /<repo-name>/ and on any other host.
  base: "./",
  server: { host: true, port: 5173 },   // host:true lets GitHub Codespaces forward the port
  build: { outDir: "dist", chunkSizeWarningLimit: 1200 }
});
