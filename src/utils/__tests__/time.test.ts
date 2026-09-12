import { describe, expect, it } from "vitest";

import { relativeTime } from "../time.ts";

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
