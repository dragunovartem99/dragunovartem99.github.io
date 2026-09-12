import { describe, expect, it } from "vitest";

import { mapLanguage } from "../mapLanguage.ts";

describe("mapLanguage", () => {
	it("pairs a language with the color linguist gives it", () => {
		expect(mapLanguage({ name: "Vue" })).toEqual({ color: "#41b883", name: "Vue" });
	});

	it("falls back to gray for a language linguist has no color for", () => {
		expect(mapLanguage({ name: "Text" })).toEqual({ color: "#8b949e", name: "Text" });
	});

	it("says nothing for a repo GitHub could not classify", () => {
		expect(mapLanguage({ name: null })).toBeNull();
	});

	it("takes the caller's color for a language linguist has never heard of", () => {
		const gradient = "linear-gradient(-45deg, #bd34fe, #47caff)";

		expect(mapLanguage({ name: "PGN", color: gradient })).toEqual({
			color: gradient,
			name: "PGN",
		});
	});
});
