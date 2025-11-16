import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  optimizeDeps: {
    include: [
      "three",
      "three/examples/jsm/loaders/OBJLoader.js",
      "three/examples/jsm/loaders/MTLLoader.js",
      "@react-three/fiber",
      "@react-three/drei",
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          three: ["three", "@react-three/fiber", "@react-three/drei"],
          threx: ["three/examples/jsm/loaders/OBJLoader.js", "three/examples/jsm/loaders/MTLLoader.js"],
        },
      },
    },
  },
});
