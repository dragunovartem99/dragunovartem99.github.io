import type { LanguageBytes, Pinned, Repo, User } from "../types.ts";

const API = "https://api.github.com";

/** GitHub asks every client to name itself; this is what this module is */
const USER_AGENT = "astro-github-page";

// Unauthenticated requests are rate-limited per IP, which a CI runner shares
// with everyone else on it — the workflow passes GITHUB_TOKEN for that reason.
async function api<T>({ path }: { path: string }): Promise<T> {
	const token = process.env.GITHUB_TOKEN;

	const response = await fetch(`${API}${path}`, {
		headers: {
			"Accept": "application/vnd.github+json",
			"User-Agent": USER_AGENT,
			"X-GitHub-Api-Version": "2022-11-28",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
	});

	if (!response.ok) {
		throw new Error(`GET ${path} failed: ${response.status} ${response.statusText}`);
	}

	return response.json() as Promise<T>;
}

// GraphQL is the only door to the profile pins, and it takes no anonymous
// callers — so unlike the REST calls above, this one needs GITHUB_TOKEN.
// GitHub answers a failed query with a 200 and an `errors` list, which counts
// as a failed request all the same.
async function graphql<T>({
	query,
	variables,
}: {
	query: string;
	variables: Record<string, unknown>;
}): Promise<T> {
	const token = process.env.GITHUB_TOKEN;

	if (!token) {
		throw new Error("GITHUB_TOKEN is required: the GraphQL API takes no anonymous requests");
	}

	const response = await fetch(`${API}/graphql`, {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${token}`,
			"Content-Type": "application/json",
			"User-Agent": USER_AGENT,
		},
		body: JSON.stringify({ query, variables }),
	});

	if (!response.ok) {
		throw new Error(`POST /graphql failed: ${response.status} ${response.statusText}`);
	}

	const { data, errors } = (await response.json()) as {
		data: T | null;
		errors?: { message: string }[];
	};

	if (errors?.length || !data) {
		throw new Error(
			`POST /graphql failed: ${errors?.map((error) => error.message).join("; ")}`
		);
	}

	return data;
}

const profiles = new Map<string, Promise<User>>();

// The profile behind the sidebar. Both the page and the favicon route want it,
// and a build is a single process, so the request is made once and shared.
// A dev server is one process too, so an edit to the profile only shows up on
// restart — which is what a build-time page means anyway.
export function fetchUser({ username }: { username: string }): Promise<User> {
	const pending = profiles.get(username) ?? api<User>({ path: `/users/${username}` });
	profiles.set(username, pending);

	return pending;
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

// Every public repo the account owns, most recently pushed first. What is worth
// showing is the caller's call — see `isShowable`.
export async function fetchRepos({ username }: { username: string }): Promise<Repo[]> {
	const repos = await api<Repo[]>({
		path: `/users/${username}/repos?per_page=100&type=owner&sort=pushed`,
	});

	return repos.toSorted((a, b) => b.pushed_at.localeCompare(a.pushed_at));
}

// One request per repo, summed into a single tally. Bytes are what the API
// offers — lines of code are not exposed anywhere.
export async function fetchLanguageBytes({
	username,
	repos,
}: {
	username: string;
	repos: Repo[];
}): Promise<LanguageBytes> {
	const tallies = await Promise.all(
		repos.map((repo) =>
			api<LanguageBytes>({ path: `/repos/${username}/${repo.name}/languages` })
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

const PINNED_QUERY = `
	query ($login: String!) {
		user(login: $login) {
			pinnedItems(first: 6, types: REPOSITORY) {
				nodes {
					... on Repository {
						name
					}
				}
			}
		}
	}
`;

// The repo names pinned on the profile, in the order the profile shows them.
// Only the names: the rest of each repo is already in `fetchRepos`.
export async function fetchPinned({ username }: { username: string }): Promise<string[]> {
	const { user } = await graphql<Pinned>({
		query: PINNED_QUERY,
		variables: { login: username },
	});

	return user.pinnedItems.nodes.map((node) => node.name);
}
