import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isDevelopment = mode === 'development';

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 5173,
      },
      watch: {
        usePolling: true,
      },
      allowedHosts: ['localhost'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@assets': path.resolve(__dirname, './src/assets'),
      },
    },
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_ENV),
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION),
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      sourcemap: isDevelopment,
      minify: 'esbuild',
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
  };
});
