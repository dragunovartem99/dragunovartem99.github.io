import { describe, expect, it } from "vitest";

import { isShowable } from "../isShowable.ts";
import { repo } from "./fixtures.ts";

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
