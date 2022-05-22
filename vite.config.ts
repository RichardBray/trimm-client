import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import path from 'node:path';

type ViteConfigInput = {
  mode: string,
  command: string,
}

export default (args: ViteConfigInput) => {
  const generateScopedName = args.mode === 'production'
  ? '[hash:base64:2]'
  : '[local]_[hash:base64:2]';

  return defineConfig({
    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, './assets'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@services': path.resolve(__dirname, './src/services'),
        '@templates': path.resolve(__dirname, './src/templates'),
      },
    },
    plugins: [react()],
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName,
      },
    },
  });
};
