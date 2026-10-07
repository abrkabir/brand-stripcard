import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    // Reference project kept in-tree for design/structure comparison. It is a
    // separate JS app with its own toolchain — linting it here only produces
    // noise that hides real findings in src/.
    "demo/**",
  ]),
]);

export default eslintConfig;
