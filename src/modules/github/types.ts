/** The slices of GitHub's REST payloads this page actually reads */

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
