import type { Language } from "../../types.ts";
import { languageColor } from "../languages.ts";

// A language name paired with its dot color. Null for a repo GitHub could not
// classify, which is a meta item the card simply does not print. `color` is for
// a caller naming a language linguist has never heard of.
export function mapLanguage({
	name,
	color,
}: {
	name: string | null;
	color?: string | undefined;
}): Language | null {
	if (name === null) return null;

	return { color: color ?? languageColor(name), name };
}
