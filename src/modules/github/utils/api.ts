import { HIDDEN_REPOS, USERNAME } from "@/constants";

import type { LanguageBytes, Repo, User } from "../types.ts";

const API = "https://api.github.com";

// Unauthenticated requests are rate-limited per IP, which a CI runner shares
// with everyone else on it — the workflow passes GITHUB_TOKEN for that reason.
async function api<T>({ path }: { path: string }): Promise<T> {
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

let profile: Promise<User> | undefined;

// The profile behind the sidebar. Both the page and the favicon route want it,
// and a build is a single process, so the request is made once and shared.
export function fetchUser(): Promise<User> {
	profile ??= api<User>({ path: `/users/${USERNAME}` });

	return profile;
}

// The avatar bytes, at the size the caller asks for
export async function fetchAvatar({ user, size }: { user: User; size: number }): Promise<Response> {
	const url = new URL(user.avatar_url);
	url.searchParams.set("s", String(size));

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`GET ${url.pathname} failed: ${response.status} ${response.statusText}`);
	}

	return response;
}

// Public, non-fork repos that describe themselves, most recently pushed first —
// a missing description means the repo is not ready to be shown off
export async function fetchRepos(): Promise<Repo[]> {
	const repos = await api<Repo[]>({
		path: `/users/${USERNAME}/repos?per_page=100&type=owner&sort=pushed`,
	});

	return repos
		.filter((repo) => !repo.fork && !repo.archived && !HIDDEN_REPOS.has(repo.name))
		.filter((repo) => repo.description !== null && repo.description.trim() !== "")
		.toSorted((a, b) => b.pushed_at.localeCompare(a.pushed_at));
}

// One request per repo, summed into a single tally. Bytes are what the API
// offers — lines of code are not exposed anywhere.
export async function fetchLanguageBytes({ repos }: { repos: Repo[] }): Promise<LanguageBytes> {
	const tallies = await Promise.all(
		repos.map((repo) =>
			api<LanguageBytes>({ path: `/repos/${USERNAME}/${repo.name}/languages` })
		)
	);

	const total: LanguageBytes = {};

	for (const tally of tallies) {
		for (const [language, bytes] of Object.entries(tally)) {
			total[language] = (total[language] ?? 0) + bytes;
		}
	}

	return total;
}
