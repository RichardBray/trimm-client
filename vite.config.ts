import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import path from "node:path";

export default defineConfig({
  resolve:{
      alias:{
        '@assets' : path.resolve(__dirname, './assets'),
        '@services' : path.resolve(__dirname, './src/services'),
      },
    },
  plugins: [react()]
});