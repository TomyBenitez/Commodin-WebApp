import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Esto permite el acceso desde la red local
    port: 3000,       // Puedes cambiar el puerto si lo necesitas
  },
})
