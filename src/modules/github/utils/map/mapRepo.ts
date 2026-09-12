import { absoluteUrl, relativeTime } from "@/utils/format";

import type { Repo, RepoView } from "../../types.ts";
import { mapLanguage } from "./mapLanguage.ts";
import { mapLicense } from "./mapLicense.ts";

// GitHub's payload turned into the handful of strings a card prints. `now` is
// the build instant, passed in so every repo on the page is dated against one
// clock and the mapping stays pure.
export function mapRepo({ repo, now }: { repo: Repo; now: Date }): RepoView {
	return {
		description: repo.description ?? "",
		forks: repo.forks_count,
		language: mapLanguage({ name: repo.language }),
		license: mapLicense({ license: repo.license }),
		name: repo.name,
		// A homepage is written as the owner typed it, so it may arrive without
		// a scheme, and an empty string means there is none
		site: repo.homepage ? absoluteUrl(repo.homepage) : null,
		stars: repo.stargazers_count,
		updated: relativeTime({ iso: repo.pushed_at, now }),
		url: repo.html_url,
	};
}
