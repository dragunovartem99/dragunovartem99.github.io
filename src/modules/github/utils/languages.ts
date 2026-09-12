import * as linguistLanguages from "linguist-languages";

/** Linguist's own gray, for a language linguist itself has no color for */
const FALLBACK = "#8b949e";

// The dot next to a language name, in the color GitHub gives it
export function languageColor(language: string): string {
	const entry = (linguistLanguages as Record<string, { color?: string }>)[language];
	return entry?.color ?? FALLBACK;
}
