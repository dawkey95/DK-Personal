import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
import prefetch from "@astrojs/prefetch";

// https://astro.build/config
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  site: "https://dk-personal.netlify.app",
  integrations: [tailwind(), sitemap(), prefetch({
    throttle: 3
  })],
  output: "server",
  adapter: netlify()
});