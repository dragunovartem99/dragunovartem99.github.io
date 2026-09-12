import { describe, expect, it } from "vitest";

import { mapRepo } from "../mapRepo.ts";
import { repo } from "./fixtures.ts";

const now = new Date("2026-01-10T12:00:00Z");

describe("mapRepo", () => {
	it("renames the payload into what a card prints", () => {
		const view = mapRepo({ repo: repo({ forks_count: 3, stargazers_count: 41 }), now });

		expect(view).toEqual({
			description: "A thing that does a thing",
			forks: 3,
			language: { color: "#3178c6", name: "TypeScript" },
			license: null,
			name: "layr",
			site: null,
			stars: 41,
			updated: "yesterday",
			url: "https://github.com/dragunovartem99/layr",
		});
	});

	it("dates the repo against the build, not the clock", () => {
		const view = mapRepo({ repo: repo({ pushed_at: "2025-10-01T00:00:00Z" }), now });

		expect(view.updated).toBe("3 months ago");
	});

	it("gives a scheme to a homepage typed without one", () => {
		const view = mapRepo({ repo: repo({ homepage: "dragunov.dev" }), now });

		expect(view.site).toBe("https://dragunov.dev");
	});

	it("reads an empty homepage as no homepage", () => {
		const view = mapRepo({ repo: repo({ homepage: "" }), now });

		expect(view.site).toBeNull();
	});

	it("keeps a description the API left empty printable", () => {
		const view = mapRepo({ repo: repo({ description: null }), now });

		expect(view.description).toBe("");
	});
});
