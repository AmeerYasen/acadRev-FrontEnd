import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/acadRev-FrontEnd/', // Replace with your repository name
  server: {
    port: 5000, // Set your desired port
    open: true, // Optional: Opens the browser automatically
  },
});
