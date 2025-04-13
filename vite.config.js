import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    base: '/', // Default for development
  };

  // Set the base path ONLY for production builds targeting GitHub Pages
  if (command === 'build') {
    // Replace <repo-name> with your actual repository name
    config.base = '/<repo-name>/';
  }

  return config;
});