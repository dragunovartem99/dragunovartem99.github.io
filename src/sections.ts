import {
	FEATURED,
	FEATURED_REPO_NAMES,
	type FeaturedProject,
	type FeaturedRepo,
} from "./featured.ts";
import type { Repo } from "./github.ts";
import { clean, counter, escape, href, languageMeta, relativeTime, tag } from "./html.ts";
import { ICONS } from "./icons.ts";

/* Featured */

function featuredRepoCard(entry: FeaturedRepo, repo: Repo): string {
	// A repo that has something to show points at the thing itself and keeps a
	// link to the code — otherwise the card is the repo already
	const site = entry.site ?? repo.homepage;

	const meta = [
		languageMeta(repo.language),
		counter(ICONS.repoForked, repo.forks_count, "forks"),
		site
			? `<a class="meta-item meta-link" href="${escape(repo.html_url)}">${ICONS.mark}Source</a>`
			: "",
	];

	return `
					<li class="card">
						<div class="card-top">
							${ICONS.repo}
							<h3 class="card-title">
								<a class="stretched" href="${escape(site ? href(site) : repo.html_url)}">${escape(repo.name)}</a>
							</h3>
							${tag(entry.tag)}
						</div>
						<p class="card-description">${escape(entry.blurb ?? repo.description ?? "")}</p>
						<div class="card-meta">
							${meta.filter(Boolean).join("\n\t\t\t\t\t\t\t")}
						</div>
					</li>`;
}

function featuredProjectCard(entry: FeaturedProject): string {
	const links = (entry.links ?? []).map(
		(link) =>
			`<a class="card-link" href="${escape(link.url)}">${ICONS.link}${escape(link.label)}</a>`
	);

	const meta = [
		languageMeta(entry.language ?? null),
		`<span class="meta-item">${ICONS.globe}${escape(clean(entry.url))}</span>`,
	];

	return `
					<li class="card">
						<div class="card-top">
							${ICONS.repo}
							<h3 class="card-title">
								<a class="stretched" href="${escape(entry.url)}">${escape(entry.title)}</a>
							</h3>
							${tag(entry.tag)}
						</div>
						<p class="card-description">${escape(entry.description)}</p>
						<div class="card-links">${links.join("\n\t\t\t\t\t\t\t")}</div>
						<div class="card-meta">
							${meta.filter(Boolean).join("\n\t\t\t\t\t\t\t")}
						</div>
					</li>`;
}

export function renderFeatured(repos: Repo[]): string {
	const byName = new Map(repos.map((repo) => [repo.name, repo]));

	const cards = FEATURED.map((entry) => {
		if (entry.kind === "project") return featuredProjectCard(entry);

		const repo = byName.get(entry.name);

		return repo ? featuredRepoCard(entry, repo) : "";
	}).filter(Boolean);

	if (cards.length === 0) return "";

	return `
			<section class="section" id="featured">
				<h2 class="section-title">${ICONS.pin}Featured</h2>
				<ul class="card-grid">${cards.join("")}
				</ul>
			</section>`;
}

/* Repositories */

function renderRepo(repo: Repo, now: Date): string {
	const meta = [
		languageMeta(repo.language),
		counter(ICONS.star, repo.stargazers_count, "stars"),
		counter(ICONS.repoForked, repo.forks_count, "forks"),
		repo.license
			? `<span class="meta-item">${ICONS.law}${escape(repo.license.spdx_id)} License</span>`
			: "",
		`<span class="meta-item">Updated ${escape(relativeTime(repo.pushed_at, now))}</span>`,
	];

	return `
					<li class="repo">
						<h3 class="repo-name">
							<a href="${escape(repo.html_url)}">${escape(repo.name)}</a>
						</h3>
						<p class="repo-description">${escape(repo.description ?? "")}</p>
						<div class="card-meta">
							${meta.filter(Boolean).join("\n\t\t\t\t\t\t\t")}
						</div>
					</li>`;
}

export function renderRepos(repos: Repo[], now: Date): string {
	const rest = repos.filter((repo) => !FEATURED_REPO_NAMES.has(repo.name));

	if (rest.length === 0) return "";

	return `
			<section class="section" id="repositories">
				<h2 class="section-title">
					${ICONS.book}Other repositories
					<span class="counter">${rest.length}</span>
				</h2>
				<ul class="repo-list">${rest.map((repo) => renderRepo(repo, now)).join("")}
				</ul>
			</section>`;
}
