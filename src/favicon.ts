import type { User } from "./github.ts";

// The avatar is square; a favicon of a person should not be. The image is
// inlined because a favicon SVG may not reach out to another origin.
export async function buildFavicon(user: User): Promise<string> {
	const url = new URL(user.avatar_url);
	url.searchParams.set("s", "180");

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`GET ${url.pathname} failed: ${response.status} ${response.statusText}`);
	}

	const type = response.headers.get("content-type") ?? "image/png";
	const data = Buffer.from(await response.arrayBuffer()).toString("base64");

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
	<clipPath id="round"><circle cx="90" cy="90" r="90" /></clipPath>
	<image href="data:${type};base64,${data}" width="180" height="180" clip-path="url(#round)" />
</svg>
`;
}
