// Turning API values into the short strings the page prints

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

const UNITS = [
	{ name: "year", ms: 365 * 24 * 60 * 60 * 1000 },
	{ name: "month", ms: 30 * 24 * 60 * 60 * 1000 },
	{ name: "week", ms: 7 * 24 * 60 * 60 * 1000 },
	{ name: "day", ms: 24 * 60 * 60 * 1000 },
	{ name: "hour", ms: 60 * 60 * 1000 },
	{ name: "minute", ms: 60 * 1000 },
] as const;

// "3 days ago", in the largest unit that fits — the build stamps this into the
// HTML, so it is only ever as fresh as the last deploy
export function relativeTime({ iso, now }: { iso: string; now: Date }): string {
	const elapsed = now.getTime() - new Date(iso).getTime();
	const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

	for (const unit of UNITS) {
		if (elapsed >= unit.ms) {
			return formatter.format(-Math.floor(elapsed / unit.ms), unit.name);
		}
	}

	return "just now";
}
