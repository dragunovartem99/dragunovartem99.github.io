import * as linguistLanguages from "linguist-languages";

/** Linguist's own gray, for a language linguist itself has no color for */
const FALLBACK = "#8b949e";

/**
 * Linguist ships one object per language, keyed by the name GitHub reports.
 * Only two of the fields matter here, and `name` is the one every entry has —
 * without it this reads as a weak type nothing is assignable to.
 */
const LANGUAGES: Record<string, { name: string; color?: string }> = linguistLanguages;

// The dot next to a language name, in the color GitHub gives it
export function languageColor(language: string): string {
	return LANGUAGES[language]?.color ?? FALLBACK;
}
