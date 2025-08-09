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
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: '@/lib/utils', replacement: path.resolve(__dirname, './src/lib/utils.ts') },
      // Fallback patterns some plugins may emit
      { find: /^src\/lib\/utils$/, replacement: path.resolve(__dirname, './src/lib/utils.ts') },
      { find: /^\/src\/lib\/utils$/, replacement: path.resolve(__dirname, './src/lib/utils.ts') },
    ],
  },
}));
