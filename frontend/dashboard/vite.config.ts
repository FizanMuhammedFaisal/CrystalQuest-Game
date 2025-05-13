import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'dashboard',
      filename: 'remoteEntry.js',

      exposes: {
        './Dashboard': './src/App.tsx'
      },
      remotes: {
        authStore: 'http://localhost:8088/assets/remoteEntry.js'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        zustand: { singleton: true },
        '@tanstack/react-query': { singleton: true }
      }
    })
  ],
  build: {
    target: 'esnext',
    minify: false,
    modulePreload: false
  }
})
