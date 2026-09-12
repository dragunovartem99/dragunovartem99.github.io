import * as linguistLanguages from "linguist-languages";

/** Linguist's own gray, for a language linguist itself has no color for */
const FALLBACK = "#8b949e";

/**
 * Linguist has no PGN entry, so a hand-picked look for the featured entries
 * that claim it anyway — chessdocs' own hero gradient, violet into cyan
 */
const PGN_GRADIENT = "linear-gradient(-45deg, #bd34fe, #47caff)";

// The dot next to a language name, in the color (or gradient) GitHub gives it
export function languageColor(language: string): string {
	if (language === "PGN") return PGN_GRADIENT;
	const entry = (linguistLanguages as Record<string, { color?: string }>)[language];
	return entry?.color ?? FALLBACK;
}
