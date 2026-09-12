import type { Repo } from "../../types.ts";

// Whether a repo is finished enough to print. A fork is someone else's work, an
// archive is over, and a repo with no description is not ready to be shown off.
// `hidden` is the caller's own list of names to drop whatever the API says.
export function isShowable({ repo, hidden }: { repo: Repo; hidden: Set<string> }): boolean {
	if (repo.fork || repo.archived || hidden.has(repo.name)) return false;

	return repo.description !== null && repo.description.trim() !== "";
}
