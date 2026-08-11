import type { LanguageBytes, LanguageSlice } from "../types.ts";
import { languageColor } from "./languages.ts";

// Every language across the public repos, by share of bytes, biggest first
export function languageBreakdown({ bytes }: { bytes: LanguageBytes }): LanguageSlice[] {
	const ranked = Object.entries(bytes).toSorted(([, a], [, b]) => b - a);
	const total = ranked.reduce((sum, [, count]) => sum + count, 0);

	if (total === 0) return [];

	return ranked.map(([language, count]) => ({
		bytes: count,
		color: languageColor(language),
		language,
		percent: (count / total) * 100,
	}));
}
