import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve:{
    alias:{
      '@': path.resolve(__dirname, 'src'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@shared': path.resolve(__dirname, '../shared')
    }
  }
})
