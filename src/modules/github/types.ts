/**
 * Two sets of types. The first is the slices of GitHub's REST payloads this
 * page actually reads — snake_case, shaped by the API. The second is what a
 * component prints, mapped from the first in `utils/map/`, so a rename on
 * GitHub's side stops at the mapper instead of reaching the markup.
 */

export type User = {
	avatar_url: string;
	bio: string | null;
	company: string | null;
	followers: number;
	following: number;
	html_url: string;
	location: string | null;
	login: string;
	name: string | null;
};

export type Repo = {
	archived: boolean;
	description: string | null;
	fork: boolean;
	forks_count: number;
	homepage: string | null;
	html_url: string;
	language: string | null;
	license: { spdx_id: string } | null;
	name: string;
	pushed_at: string;
	stargazers_count: number;
	topics: string[];
};

/** Bytes of code per language, as GitHub's linguist counts them */
export type LanguageBytes = Record<string, number>;

/** One language's share of every public repo, ready to draw */
export type LanguageSlice = {
	bytes: number;
	color: string;
	language: string;
	percent: number;
};

/** A language and the dot that goes beside it */
export type Language = {
	color: string;
	name: string;
};

/** A repo as a card or a row prints it */
export type RepoView = {
	description: string;
	forks: number;
	language: Language | null;
	/** Spelled out, e.g. "MIT License" */
	license: string | null;
	name: string;
	/** The repo's own homepage, made absolute — null when it has none */
	site: string | null;
	stars: number;
	/** Relative to the build, e.g. "3 days ago" */
	updated: string;
	/** The repo on GitHub */
	url: string;
};

/** The profile as the sidebar and the head print it */
export type ProfileView = {
	avatarUrl: string;
	bio: string | null;
	followers: number;
	following: number;
	location: string | null;
	login: string;
	/** The display name, falling back to the login when the profile has none */
	name: string;
	url: string;
};
