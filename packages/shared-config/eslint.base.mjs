import js from "@eslint/js";
import globals from "globals";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

const config = [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      ".turbo/**",
      "**/vitest.config.ts",
    ],
  },

  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: [
          "./tsconfig.json",
          "./apps/*/tsconfig.json",
          "./apps/*/tsconfig.tools.json",
          "./packages/*/tsconfig.json",
          "./packages/*/tsconfig.tools.json",
        ],
        tsconfigRootDir: repoRoot,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
        },
      ],
      "no-console": "off",
    },
  },
];

export default config;