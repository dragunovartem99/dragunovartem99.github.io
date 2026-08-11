import { describe, expect, it } from "vitest";

import { absoluteUrl, relativeTime, shortUrl } from "../format.ts";

describe("absoluteUrl", () => {
	it("leaves an https URL alone", () => {
		const url = "https://chessdocs.org/openings";

		const result = absoluteUrl(url);

		expect(result).toBe("https://chessdocs.org/openings");
	});

	it("leaves an http URL alone", () => {
		const url = "http://puzzfinder.local";

		const result = absoluteUrl(url);

		expect(result).toBe("http://puzzfinder.local");
	});

	it("prefixes a bare host, which an href would otherwise read as a path", () => {
		const url = "dragunov.dev";

		const result = absoluteUrl(url);

		expect(result).toBe("https://dragunov.dev");
	});
});

describe("shortUrl", () => {
	it("drops the scheme", () => {
		const result = shortUrl({ url: "https://chessdocs.org" });

		expect(result).toBe("chessdocs.org");
	});

	it("drops a www subdomain", () => {
		const result = shortUrl({ url: "https://www.lichess.org" });

		expect(result).toBe("lichess.org");
	});

	it("drops the query and the fragment", () => {
		const result = shortUrl({ url: "https://github.com/layr?tab=readme#install" });

		expect(result).toBe("github.com/layr");
	});

	it("drops a trailing slash", () => {
		const result = shortUrl({ url: "https://dragunov.dev/work/" });

		expect(result).toBe("dragunov.dev/work");
	});

	it("keeps anything inside the limit whole", () => {
		const result = shortUrl({ url: "https://dragunov.dev", limit: 20 });

		expect(result).toBe("dragunov.dev");
	});

	it("truncates past the limit, ellipsis included in the budget", () => {
		const result = shortUrl({ url: "https://dragunov.dev/notes/endgames", limit: 20 });

		expect(result).toBe("dragunov.dev/notes/…");
	});
});

describe("relativeTime", () => {
	const now = new Date("2026-01-10T12:00:00Z");

	it("counts in years once a year has passed", () => {
		const result = relativeTime({ iso: "2024-11-02T09:30:00Z", now });

		expect(result).toBe("last year");
	});

	it("counts in months below a year", () => {
		const result = relativeTime({ iso: "2025-10-01T00:00:00Z", now });

		expect(result).toBe("3 months ago");
	});

	it("counts in days below a week", () => {
		const result = relativeTime({ iso: "2026-01-08T12:00:00Z", now });

		expect(result).toBe("2 days ago");
	});

	it("counts in whole hours below a day, rounding down", () => {
		const result = relativeTime({ iso: "2026-01-10T10:15:00Z", now });

		expect(result).toBe("1 hour ago");
	});

	it("falls back to a phrase when nothing reaches a minute", () => {
		const result = relativeTime({ iso: "2026-01-10T11:59:30Z", now });

		expect(result).toBe("just now");
	});
});
