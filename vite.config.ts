import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  build: {
    typescript: {
      noEmit: true,
      noEmitOnError: false,
    },
  },
});
