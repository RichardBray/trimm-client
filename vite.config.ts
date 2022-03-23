import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslintPlugin from 'vite-plugin-eslint';

import path from "node:path";

export default defineConfig({
  resolve:{
      alias:{
        '@assets' : path.resolve(__dirname, './assets'),
      },
    },
  // plugins: [react(), eslintPlugin()]
  plugins: [react()]
});