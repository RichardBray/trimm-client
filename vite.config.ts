import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslintPlugin from 'vite-plugin-eslint';

import path from "node:path";

export default defineConfig({
  resolve:{
      alias:{
        '~' : path.resolve(__dirname,)
      },
    },
  plugins: [react(), eslintPlugin()]
});