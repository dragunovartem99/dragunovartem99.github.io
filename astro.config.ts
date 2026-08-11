import { defineConfig } from "astro/config";

import { SITE_URL } from "./src/constants.ts";

export default defineConfig({
	site: SITE_URL,

	// GitHub Pages serves this repo at the domain root, and the whole site is
	// one page — no base path, no route formatting to worry about.
	trailingSlash: "never",
});
