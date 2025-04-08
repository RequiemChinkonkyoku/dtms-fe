import { defineConfig } from "eslint/config";
import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: { globals: globals.browser },
  },
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.js", "**/*.jsx"],
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/no-unresolved": "error",
      "import/no-case-sensitive": "error", // this is what you're looking for
    },
  },
]);
