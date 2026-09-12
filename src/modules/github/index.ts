/** Everything the page knows about GitHub: the API calls, the tallies, the mapping */

export { fetchAvatar, fetchLanguageBytes, fetchRepos, fetchUser } from "./utils/api.ts";
export { languageBreakdown } from "./utils/breakdown.ts";
export { languageColor } from "./utils/languages.ts";
export { isShowable } from "./utils/map/isShowable.ts";
export { mapLanguage } from "./utils/map/mapLanguage.ts";
export { mapProfile } from "./utils/map/mapProfile.ts";
export { mapRepo } from "./utils/map/mapRepo.ts";
export type {
	Language,
	LanguageBytes,
	LanguageSlice,
	ProfileView,
	Repo,
	RepoView,
	User,
} from "./types.ts";
