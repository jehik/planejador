import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'lucide-react': path.resolve(__dirname, 'src/components/Icons.jsx')
    }
  },
  server: {
    host: true,
    port: 5173,
    hmr: {
      overlay: false
    }
  }
})
