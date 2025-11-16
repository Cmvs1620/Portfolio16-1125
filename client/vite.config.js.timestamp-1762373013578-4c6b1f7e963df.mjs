// vite.config.js
import { defineConfig } from "file:///Users/carl-maurits.vonschantz/Desktop/PRIVATE/1.7%20finals%20(hopefully/React-Portfolio-main%204/client/node_modules/vite/dist/node/index.js";
import react from "file:///Users/carl-maurits.vonschantz/Desktop/PRIVATE/1.7%20finals%20(hopefully/React-Portfolio-main%204/client/node_modules/@vitejs/plugin-react/dist/index.mjs";
import tailwindcss from "file:///Users/carl-maurits.vonschantz/Desktop/PRIVATE/1.7%20finals%20(hopefully/React-Portfolio-main%204/client/node_modules/@tailwindcss/vite/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/Users/carl-maurits.vonschantz/Desktop/PRIVATE/1.7 finals (hopefully/React-Portfolio-main 4/client";
var vite_config_default = defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__vite_injected_original_dirname, "./src") } },
  optimizeDeps: {
    include: [
      "three",
      "three/examples/jsm/loaders/OBJLoader.js",
      "three/examples/jsm/loaders/MTLLoader.js",
      "@react-three/fiber",
      "@react-three/drei"
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          three: ["three", "@react-three/fiber", "@react-three/drei"],
          threx: ["three/examples/jsm/loaders/OBJLoader.js", "three/examples/jsm/loaders/MTLLoader.js"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvY2FybC1tYXVyaXRzLnZvbnNjaGFudHovRGVza3RvcC9QUklWQVRFLzEuNyBmaW5hbHMgKGhvcGVmdWxseS9SZWFjdC1Qb3J0Zm9saW8tbWFpbiA0L2NsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2NhcmwtbWF1cml0cy52b25zY2hhbnR6L0Rlc2t0b3AvUFJJVkFURS8xLjcgZmluYWxzIChob3BlZnVsbHkvUmVhY3QtUG9ydGZvbGlvLW1haW4gNC9jbGllbnQvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2NhcmwtbWF1cml0cy52b25zY2hhbnR6L0Rlc2t0b3AvUFJJVkFURS8xLjclMjBmaW5hbHMlMjAoaG9wZWZ1bGx5L1JlYWN0LVBvcnRmb2xpby1tYWluJTIwNC9jbGllbnQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gXCJAdGFpbHdpbmRjc3Mvdml0ZVwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIHRhaWx3aW5kY3NzKCldLFxuICByZXNvbHZlOiB7IGFsaWFzOiB7IFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpIH0gfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogW1xuICAgICAgXCJ0aHJlZVwiLFxuICAgICAgXCJ0aHJlZS9leGFtcGxlcy9qc20vbG9hZGVycy9PQkpMb2FkZXIuanNcIixcbiAgICAgIFwidGhyZWUvZXhhbXBsZXMvanNtL2xvYWRlcnMvTVRMTG9hZGVyLmpzXCIsXG4gICAgICBcIkByZWFjdC10aHJlZS9maWJlclwiLFxuICAgICAgXCJAcmVhY3QtdGhyZWUvZHJlaVwiLFxuICAgIF0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIHJlYWN0OiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiXSxcbiAgICAgICAgICB0aHJlZTogW1widGhyZWVcIiwgXCJAcmVhY3QtdGhyZWUvZmliZXJcIiwgXCJAcmVhY3QtdGhyZWUvZHJlaVwiXSxcbiAgICAgICAgICB0aHJleDogW1widGhyZWUvZXhhbXBsZXMvanNtL2xvYWRlcnMvT0JKTG9hZGVyLmpzXCIsIFwidGhyZWUvZXhhbXBsZXMvanNtL2xvYWRlcnMvTVRMTG9hZGVyLmpzXCJdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThkLFNBQVMsb0JBQW9CO0FBQzNmLE9BQU8sV0FBVztBQUNsQixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLFVBQVU7QUFIakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUM7QUFBQSxFQUNoQyxTQUFTLEVBQUUsT0FBTyxFQUFFLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU8sRUFBRSxFQUFFO0FBQUEsRUFDNUQsY0FBYztBQUFBLElBQ1osU0FBUztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLE9BQU8sQ0FBQyxTQUFTLFdBQVc7QUFBQSxVQUM1QixPQUFPLENBQUMsU0FBUyxzQkFBc0IsbUJBQW1CO0FBQUEsVUFDMUQsT0FBTyxDQUFDLDJDQUEyQyx5Q0FBeUM7QUFBQSxRQUM5RjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
