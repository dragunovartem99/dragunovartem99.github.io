// oxfmt has no Astro support, so `.astro` files go through Prettier with the same shared config
import config from "@dragunovartem99/oxfmt-config/prettier";

/** @type {import("prettier").Config} */
export default { ...config, plugins: ["prettier-plugin-astro"] };
