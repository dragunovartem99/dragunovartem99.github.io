import shared from "@dragunovartem99/prettier-config" with { type: "json" };

/** Personal Prettier config, plus what Astro needs on top */
export default {
	...shared,
	plugins: ["prettier-plugin-astro"],
	overrides: [{ files: "*.astro", options: { parser: "astro" } }],
};
