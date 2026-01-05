import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'rezel',
      formats: ['es', 'cjs'],
      fileName: (format) => `rezel.${format}.js`,
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {},
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [
    dts({
      insertTypesEntry: true, // Adds "types" field to package.json automatically
      rollupTypes: true, // Merges all declarations into one file (cleaner for users)
    }),
  ],
});
