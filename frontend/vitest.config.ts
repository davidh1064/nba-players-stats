import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  // JSX is transformed by esbuild rather than @vitejs/plugin-react, which
  // currently requires a Vite major that conflicts with Vitest's own.
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  resolve: {
    // Mirrors the "@/*" path alias from tsconfig.json.
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
