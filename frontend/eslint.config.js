import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Allow colocated utility exports in component files
      "react-refresh/only-export-components": [
        "off",
        { allowConstantExport: true },
      ],
      // Empty interfaces are sometimes used as extension points in UI
      "@typescript-eslint/no-empty-object-type": "off",
      // Tailwind config may use require()
      "@typescript-eslint/no-require-imports": "off",
      // Keep unused-vars relaxed for generated patterns
      "@typescript-eslint/no-unused-vars": "off",
      // Allow empty catch blocks
      "no-empty": ["error", { "allowEmptyCatch": true }],
    },
  }
);
