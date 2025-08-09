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
    alias: [
      // Put the specific mapping first so it takes precedence over '@'
      { find: '@/lib/utils', replacement: path.resolve(__dirname, './src/lib/utils.ts') },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
  },
}));
