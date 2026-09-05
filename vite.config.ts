import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

import fs from 'fs';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'serve-bang-diem-folder',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const decodedUrl = decodeURI(req.url || '');
            if (decodedUrl.startsWith('/bang_diem/')) {
              const filename = decodedUrl.replace('/bang_diem/', '').split('?')[0];
              const localPath = path.resolve(__dirname, 'bảng điểm', filename);
              if (fs.existsSync(localPath)) {
                res.setHeader('Content-Type', 'image/jpeg');
                return fs.createReadStream(localPath).pipe(res);
              }
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 2010,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
