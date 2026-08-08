/** Subset of github/linguist colors — the languages that actually show up */
const COLORS: Record<string, string> = {
	"C": "#555555",
	"C++": "#f34b7d",
	"CSS": "#663399",
	"Dockerfile": "#384d54",
	"Go": "#00add8",
	"HTML": "#e34c26",
	"Java": "#b07219",
	"JavaScript": "#f1e05a",
	"Lua": "#000080",
	"Makefile": "#427819",
	"Markdown": "#083fa1",
	"Nix": "#7e7eff",
	"Python": "#3572a5",
	"Ruby": "#701516",
	"Rust": "#dea584",
	"SCSS": "#c6538c",
	"Shell": "#89e051",
	"Svelte": "#ff3e00",
	"TypeScript": "#3178c6",
	"Vim Script": "#199f4b",
	"Vue": "#41b883",
};

const FALLBACK = "#8b949e";

export function languageColor(language: string): string {
	return COLORS[language] ?? FALLBACK;
}
