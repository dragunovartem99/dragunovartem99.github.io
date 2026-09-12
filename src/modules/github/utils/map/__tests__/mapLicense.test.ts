import { describe, expect, it } from "vitest";

import { mapLicense } from "../mapLicense.ts";

describe("mapLicense", () => {
	it("spells out the SPDX id", () => {
		expect(mapLicense({ license: { spdx_id: "MIT" } })).toBe("MIT License");
	});

	it("says nothing for a repo with no license", () => {
		expect(mapLicense({ license: null })).toBeNull();
	});

	it("says nothing for a license GitHub could not identify", () => {
		expect(mapLicense({ license: { spdx_id: "NOASSERTION" } })).toBeNull();
	});
});
