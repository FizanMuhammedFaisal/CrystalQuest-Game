import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'host',
      remotes: {
        game: 'http://localhost:8080/assets/remoteEntry.js',
        auth: 'http://localhost:8081/assets/remoteEntry.js',
        portal: 'http://localhost:8082/assets/remoteEntry.js',
        dashboard: 'http://localhost:8083/assets/remoteEntry.js'
      },
      shared: ['react', 'react-dom']
    })
  ],
  build: {
    target: 'esnext',
    minify: false,
    modulePreload: false,
    cssCodeSplit: false,
    assetsInlineLimit: 0
  },
  optimizeDeps: {
    exclude: ['game/Game']
  }
})
