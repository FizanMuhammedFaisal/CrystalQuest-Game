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
        game: 'http://localhost:8080/assets/remoteEntry.js',
        authStore: 'http://localhost:8088/assets/remoteEntry.js'
      },
      exposes: {
        './Auth': './src/App.tsx',
        './Navbar': './src/components/Navbar.tsx'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        zustand: { singleton: true }
      }
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
