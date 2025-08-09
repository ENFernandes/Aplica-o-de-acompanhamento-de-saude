import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8000,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Explicit alias to satisfy CI/rollup resolving without extension
      "@/lib/utils": path.resolve(__dirname, "./src/lib/utils.ts"),
    },
  },
}));
