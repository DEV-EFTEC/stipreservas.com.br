import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/",
  preview: {
    port: parseInt(process.env.PORT) || 4173,
    host: true,
    allowedHosts: ['react-frontend-production-aed8.up.railway.app', 'api.stip-reservas.com.br']
  },
});
