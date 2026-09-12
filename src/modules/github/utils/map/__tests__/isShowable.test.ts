import { describe, expect, it } from "vitest";

import type { Repo } from "../../../types.ts";
import { isShowable } from "../isShowable.ts";

// Only the fields the predicate reads matter; the rest is filled in so the
// fixture is a real Repo
function repo(overrides: Partial<Repo> = {}): Repo {
	return {
		archived: false,
		description: "A thing that does a thing",
		fork: false,
		forks_count: 0,
		homepage: null,
		html_url: "https://github.com/dragunovartem99/layr",
		language: "TypeScript",
		license: null,
		name: "layr",
		pushed_at: "2026-01-09T12:00:00Z",
		stargazers_count: 0,
		topics: [],
		...overrides,
	};
}

const hidden = new Set(["dragunovartem99"]);

describe("isShowable", () => {
	it("shows a described, owned, live repo", () => {
		expect(isShowable({ repo: repo(), hidden })).toBe(true);
	});

	it("drops a fork, which is someone else's work", () => {
		expect(isShowable({ repo: repo({ fork: true }), hidden })).toBe(false);
	});

	it("drops an archived repo", () => {
		expect(isShowable({ repo: repo({ archived: true }), hidden })).toBe(false);
	});

	it("drops a repo the caller hides by name", () => {
		expect(isShowable({ repo: repo({ name: "dragunovartem99" }), hidden })).toBe(false);
	});

	it("drops a repo with no description", () => {
		expect(isShowable({ repo: repo({ description: null }), hidden })).toBe(false);
	});

	it("drops a description that is only whitespace", () => {
		expect(isShowable({ repo: repo({ description: "   " }), hidden })).toBe(false);
	});
});
