import type { Repo } from "../../types.ts";

// "MIT License", from the SPDX id the API carries. A repo with no license, or
// one linguist could not identify (`NOASSERTION`), says nothing at all.
export function mapLicense({ license }: { license: Repo["license"] }): string | null {
	if (license === null || license.spdx_id === "NOASSERTION") return null;

	return `${license.spdx_id} License`;
}
