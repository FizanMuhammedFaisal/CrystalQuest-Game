import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'portal',
      filename: 'remoteEntry.js',
      remotes: {
        game: 'http://localhost:8080/assets/remoteEntry.js'
      },
      exposes: {
        './Portal': './src/App.tsx'
      },
      shared: ['react', 'react-dom']
    })
  ],
  build: {
    target: 'esnext',
    minify: false,
    modulePreload: false
  }
})
