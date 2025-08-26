// vite.config.js  (ESM)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/FERPA-Helper/",         // case-sensitive, matches your repo name
  plugins: [react()],
});
