/** Everything the page knows about GitHub: the API calls and the tallies */

export { fetchAvatar, fetchLanguageBytes, fetchRepos, fetchUser } from "./utils/api.ts";
export { languageBreakdown } from "./utils/breakdown.ts";
export { languageColor } from "./utils/languages.ts";
export type { LanguageBytes, LanguageSlice, Repo, User } from "./types.ts";
