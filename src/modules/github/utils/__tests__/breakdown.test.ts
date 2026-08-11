import { describe, expect, it } from "vitest";

import { languageBreakdown } from "../breakdown.ts";

describe("languageBreakdown", () => {
	it("ranks languages by share of bytes, biggest first", () => {
		const bytes = { CSS: 12_400, Lua: 3_100, TypeScript: 48_900 };

		const slices = languageBreakdown({ bytes });

		expect(slices.map((slice) => slice.language)).toEqual(["TypeScript", "CSS", "Lua"]);
	});

	it("turns bytes into percentages of the whole", () => {
		const bytes = { Rust: 3_000, Shell: 1_000 };

		const slices = languageBreakdown({ bytes });

		expect(slices.map((slice) => slice.percent)).toEqual([75, 25]);
	});

	it("colors a slice the way linguist does", () => {
		const bytes = { Vue: 5_000 };

		const slices = languageBreakdown({ bytes });

		expect(slices[0]?.color).toBe("#41b883");
	});

	it("falls back to gray for a language the palette has not met", () => {
		const bytes = { Brainfuck: 700 };

		const slices = languageBreakdown({ bytes });

		expect(slices[0]?.color).toBe("#8b949e");
	});

	it("returns nothing when there are no languages", () => {
		const slices = languageBreakdown({ bytes: {} });

		expect(slices).toEqual([]);
	});

	it("returns nothing when every tally is empty, rather than dividing by zero", () => {
		const slices = languageBreakdown({ bytes: { Makefile: 0, Nix: 0 } });

		expect(slices).toEqual([]);
	});
});
