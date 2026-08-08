import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { fetchRepos, fetchUser } from "./github.ts";
import { renderPage } from "./render.ts";

const ROOT = join(import.meta.dirname, "..");
const DIST = join(ROOT, "dist");

const [user, repos] = await Promise.all([fetchUser(), fetchRepos()]);

await mkdir(DIST, { recursive: true });
await writeFile(join(DIST, "index.html"), renderPage(user, repos, new Date()));
await copyFile(join(ROOT, "src", "styles.css"), join(DIST, "styles.css"));
await writeFile(join(DIST, ".nojekyll"), "");

console.log(`Built ${repos.length} repos into dist/`);
