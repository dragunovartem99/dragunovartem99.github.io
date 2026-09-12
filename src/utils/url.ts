// Turning URLs into the form an href or a line of link text wants

// A repo homepage is written as the owner typed it, so it may arrive without a
// scheme — an href without one is read as a relative path
export function absoluteUrl(url: string): string {
	return /^https?:\/\//u.test(url) ? url : `https://${url}`;
}

// Link text, not a link: the scheme, the query and a runaway path are noise
export function shortUrl({ url, limit = 44 }: { url: string; limit?: number }): string {
	const bare = url
		.replace(/^https?:\/\//u, "")
		.replace(/^www\./u, "")
		.replace(/[?#].*$/u, "")
		.replace(/\/$/u, "");

	return bare.length > limit ? `${bare.slice(0, limit - 1)}…` : bare;
}
