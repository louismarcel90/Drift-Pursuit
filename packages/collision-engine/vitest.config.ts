import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@drift-pursuit-grid/contracts": resolve(__dirname, "../contracts/src/index.ts"),
      "@drift-pursuit-grid/domain": resolve(__dirname, "../domain/src/index.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    passWithNoTests: true,
  },
});