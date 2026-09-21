import type { Language } from "../../types.ts";
import { languageColor } from "../languages.ts";

// A language name paired with its dot color. Null for a repo GitHub could not
// classify, which is a meta item the card simply does not print.
export function mapLanguage({ name }: { name: string | null }): Language | null {
	if (name === null) return null;

	return { color: languageColor(name), name };
}
