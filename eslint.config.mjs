import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // WordPress backup directories at repo root:
    "cacsalva_11760/**",
    "wp_www.cacsalvationcenter.org_2026-06-16_23-14-16/**",
  ]),
]);

export default eslintConfig;
