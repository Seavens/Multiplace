import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import robloxTs from "eslint-plugin-roblox-ts";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const typescriptFiles = ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"];
const typescriptConfigs = typescriptEslint.configs["flat/recommended-type-checked"].map((config) => ({
  ...config,
  files: typescriptFiles
}));
const robloxRecommended = robloxTs.configs.recommended;

export default [
  {
    ignores: ["**/node_modules/**", "**/out/**", "eslint.config.mjs"]
  },
  js.configs.recommended,
  ...typescriptConfigs,
  {
    ...robloxRecommended,
    files: typescriptFiles,
    languageOptions: {
      ...robloxRecommended.languageOptions,
      parserOptions: {
        ...robloxRecommended.languageOptions.parserOptions,
        projectService: true,
        tsconfigRootDir: __dirname
      }
    }
  },
  prettierRecommended,
  {
    files: typescriptFiles,
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2018,
      sourceType: "module",
      parserOptions: {
        jsx: true,
        useJSXTextNode: true,
        projectService: true,
        tsconfigRootDir: __dirname
      }
    },
    plugins: {
      "simple-import-sort": simpleImportSort
    },
    rules: {
      "prettier/prettier": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports" }],
      "@typescript-eslint/array-type": ["error", { "default": "generic" }],
      "@typescript-eslint/no-namespace": ["error", { "allowDeclarations": true }],
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "roblox-ts/lua-truthiness": "off",
      "curly": ["error", "all"],
      "no-else-return": "error",
      "no-void": ["error", { allowAsStatement: true }]
    }
  }
];
