// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://angelo-francisco.github.io",
  base: "/angelx",
  output: "static",
  trailingSlash: "always",
  integrations: [mdx(), sitemap()],
  // Hashed scripts/styles work on static GitHub Pages without unsafe-inline.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' https: data:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
    },
  },
  // Avoid inline styles from Shiki, which conflict with a strict CSP.
  markdown: { syntaxHighlight: false },
});
