import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, "", "");

  return {
    plugins: [react(), tailwindcss()],
    base: env.VITE_BASE_PATH || "/", // Use env variable or default to '/'
    server: {
      port: parseInt(env.VITE_PORT) || 5000, // Use env variable or default to 5000
      open: env.VITE_SERVER_OPEN === "true", // Convert string to boolean
    },
  };
});
