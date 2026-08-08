import { HIDDEN_REPOS, USERNAME } from "./config.ts";

export type User = {
	avatar_url: string;
	bio: string | null;
	blog: string | null;
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

const API = "https://api.github.com";

async function api<T>(path: string): Promise<T> {
	const token = process.env.GITHUB_TOKEN;

	const response = await fetch(`${API}${path}`, {
		headers: {
			"Accept": "application/vnd.github+json",
			"User-Agent": USERNAME,
			"X-GitHub-Api-Version": "2022-11-28",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
	});

	if (!response.ok) {
		throw new Error(`GET ${path} failed: ${response.status} ${response.statusText}`);
	}

	return response.json() as Promise<T>;
}

export function fetchUser(): Promise<User> {
	return api<User>(`/users/${USERNAME}`);
}

// Public, non-fork repos that describe themselves, most recently pushed first —
// a missing description means the repo is not ready to be shown off
export async function fetchRepos(): Promise<Repo[]> {
	const repos = await api<Repo[]>(`/users/${USERNAME}/repos?per_page=100&type=owner&sort=pushed`);

	return repos
		.filter((repo) => !repo.fork && !repo.archived && !HIDDEN_REPOS.has(repo.name))
		.filter((repo) => repo.description !== null && repo.description.trim() !== "")
		.toSorted((a, b) => b.pushed_at.localeCompare(a.pushed_at));
}
