import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
import reactRefresh from '@vitejs/plugin-react-refresh';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    // ... other server options
    cors: {
      origin: "https://accounts.google.com", // Allow requests to Google's endpoints
    },
    port: 3000,
  },
});
