// The two ways this module talks to GitHub: REST and GraphQL

const API = "https://api.github.com";

/** GitHub asks every client to name itself; this is what this module is */
const USER_AGENT = "astro-github-page";

// Unauthenticated requests are rate-limited per IP, which a CI runner shares
// with everyone else on it — the workflow passes GITHUB_TOKEN for that reason.
export async function api<T>({ path }: { path: string }): Promise<T> {
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
// callers — so unlike the REST calls in `api`, this one needs GITHUB_TOKEN.
// GitHub answers a failed query with a 200 and an `errors` list, which counts
// as a failed request all the same.
export async function graphql<T>({
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
