import { defineConfig } from 'vite';
import { cpSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  plugins: [
    {
      name: 'copy-original-assets',
      closeBundle() {
        const files = readdirSync('.');

        for (const file of files) {
          if (
            file.endsWith('.js') &&
            file !== 'vite.config.js'
          ) {
            cpSync(file, join('dist', file));
          }
        }

        const folders = [
          'images',
          'music',
          'textures',
          'Misty Photos',
          'Mr.X and Mr.X'
        ];

        for (const folder of folders) {
          if (existsSync(folder)) {
            cpSync(folder, join('dist', folder), {
              recursive: true
            });
          }
        }
      }
    }
  ]
});
