import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@drift-pursuit-grid/contracts": resolve(__dirname, "../contracts/src/index.ts"),
      "@drift-pursuit-grid/domain": resolve(__dirname, "../domain/src/index.ts"),
      "@drift-pursuit-grid/deterministic-rng": resolve(
        __dirname,
        "../deterministic-rng/src/index.ts",
      ),
      "@drift-pursuit-grid/state-store": resolve(__dirname, "../state-store/src/index.ts"),
      "@drift-pursuit-grid/vehicle-dynamics": resolve(
        __dirname,
        "../vehicle-dynamics/src/index.ts",
      ),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    passWithNoTests: true,
  },
});
