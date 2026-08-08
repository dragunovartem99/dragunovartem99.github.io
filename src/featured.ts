/**
 * The handpicked work shown on top of the page, in this order.
 *
 * An entry is either a repo reference — the title, description, language and
 * counters are filled in from the GitHub API — or a standalone project that
 * lives anywhere at all and is described here by hand.
 *
 * A repo reference whose repo is missing from the API is skipped, so trimming
 * the list is always safe.
 */

export type FeaturedRepo = {
	kind: "repo";
	/** Repo name, as in github.com/<user>/<name> */
	name: string;
	/** Overrides the repo description when the API blurb is too dry */
	blurb?: string;
	/**
	 * Where the card points — a demo, a docs page, anything worth seeing before
	 * the code. Defaults to the repo homepage; the code is always one click away
	 * under "Source".
	 */
	site?: string;
	/** Small chip above the title, e.g. "Chess", "Tooling" */
	tag?: string;
};

export type FeaturedProject = {
	kind: "project";
	title: string;
	description: string;
	/** Where the card points */
	url: string;
	/** Small chip above the title, e.g. "Website", "Package" */
	tag?: string;
	/** Colored dot next to the meta line, same idea as a repo language */
	language?: string;
	/** Extra links under the description */
	links?: { label: string; url: string }[];
};

export type FeaturedEntry = FeaturedRepo | FeaturedProject;

export const FEATURED: FeaturedEntry[] = [
	{
		kind: "project",
		title: "chessdocs",
		description: "A free guide to the rules, strategies, and key principles of the game",
		url: "https://chessdocs.org/",
		tag: "Chess",
		language: "TypeScript",
	},

	{ kind: "repo", name: "puzzfinder", tag: "Chess" },
	{
		kind: "repo",
		name: "html-diagram",
		tag: "Chess",
		site: "https://dragunovartem99.github.io/html-diagram",
	},
	{
		kind: "repo",
		name: "vue-pgn-viewer",
		tag: "Chess",
		site: "https://dragunovartem99.github.io/vue-pgn-viewer",
	},
	{ kind: "repo", name: "layr", tag: "Analytics" },
	{ kind: "repo", name: "tomorrow-night.nvim", tag: "Colorscheme" },
];

export const FEATURED_REPO_NAMES = new Set(
	FEATURED.filter((entry) => entry.kind === "repo").map((entry) => entry.name)
);
