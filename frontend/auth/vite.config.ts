import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'auth',
      filename: 'remoteEntry.js',
      remotes: {
        game: 'http://localhost:8080/assets/remoteEntry.js'
      },
      exposes: {
        './Auth': './src/App.tsx'
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  build: {
    target: 'esnext',
    minify: false,
    modulePreload: false,
    cssCodeSplit: false,
    assetsInlineLimit: 0
  }
})
