import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { sidebar } from "./src/sidebar.mjs";

export default defineConfig({
      site: process.env.SITE_URL ?? "https://example.com",
  base: process.env.BASE_PATH ?? "/",
  integrations: [
    starlight({
      title: "Bight.ts",
      description: "The modern Discord-first framework for readable, TypeScript-first bot architecture.",
      disable404Route: true,
      favicon: '/favicon.ico',
      customCss: ["./src/styles/custom.css"],
      sidebar,
    }),
  ],
});
