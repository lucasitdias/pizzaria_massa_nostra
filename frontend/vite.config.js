import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: false,       // Garante que o Vite use HTTP
    port: 5173,         // Porta padrão do Vite
    strictPort: true,   // Garante que ele não mude a porta se estiver ocupada
    open: true          // Abre o navegador automaticamente ao iniciar
  }
})
