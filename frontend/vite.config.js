import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 6001,
    allowedHosts: [
      'dashboard.lakebreezeresorts.com',
      'api.lakebreezeresorts.com',
      'lakebreezeresorts.com',
      'www.lakebreezeresorts.com'
    ]
  }
})
