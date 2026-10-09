import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// .mts so Vite loads this as native ESM; as a .ts file in a CommonJS package
// it warns that the ESM syntax is unsupported by its upcoming config loader.
export default defineConfig({
  resolve: {
    // Mirrors the "@/*" path alias from tsconfig.json. (__dirname does not
    // exist in ESM, hence import.meta.url.)
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
