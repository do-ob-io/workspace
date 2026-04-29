// https://vite.dev/config/
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
    tailwindcss(),
  ],
  server: {
    host: true,
    allowedHosts: ['.localhost'],
  },
  resolve: {
    tsconfigPaths: true,
  },
});
