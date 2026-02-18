import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(mode === 'lib' ? [cssInjectedByJsPlugin()] : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  ...(mode === 'lib'
    ? {
        build: {
          lib: {
            entry: 'src/web-component.jsx',
            formats: ['iife'],
            name: 'WorkflowStatesCanvas',
            fileName: () => 'workflow-states-canvas.js',
          },
          rollupOptions: {
            output: { inlineDynamicImports: true },
          },
        },
      }
    : {}),
}))
