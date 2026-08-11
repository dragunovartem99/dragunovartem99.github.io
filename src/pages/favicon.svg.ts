import type { APIRoute } from "astro";

import { fetchAvatar, fetchUser } from "@/modules/github";

const SIZE = 180;

// The avatar is square; a favicon of a person should not be. The image is
// inlined because a favicon SVG may not reach out to another origin.
export const GET: APIRoute = async () => {
	const user = await fetchUser();
	const response = await fetchAvatar({ user, size: SIZE });

	const type = response.headers.get("content-type") ?? "image/png";
	const data = Buffer.from(await response.arrayBuffer()).toString("base64");

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">
	<clipPath id="round"><circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2}" /></clipPath>
	<image href="data:${type};base64,${data}" width="${SIZE}" height="${SIZE}" clip-path="url(#round)" />
</svg>
`;

	return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
};
