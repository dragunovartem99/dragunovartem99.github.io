import { SITE_URL, USERNAME } from "./config.ts";
import type { Repo, User } from "./github.ts";
import { ICONS } from "./icons.ts";
import { languageColor } from "./languages.ts";

const ESCAPES: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};

function escape(value: string): string {
	return value.replaceAll(/[&<>"']/gu, (char) => ESCAPES[char] ?? char);
}

function href(url: string): string {
	return url.startsWith("http") ? url : `https://${url}`;
}

const UNITS = [
	{ name: "year", ms: 365 * 24 * 60 * 60 * 1000 },
	{ name: "month", ms: 30 * 24 * 60 * 60 * 1000 },
	{ name: "week", ms: 7 * 24 * 60 * 60 * 1000 },
	{ name: "day", ms: 24 * 60 * 60 * 1000 },
	{ name: "hour", ms: 60 * 60 * 1000 },
	{ name: "minute", ms: 60 * 1000 },
] as const;

function relativeTime(iso: string, now: Date): string {
	const elapsed = now.getTime() - new Date(iso).getTime();
	const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

	for (const unit of UNITS) {
		if (elapsed >= unit.ms) {
			return formatter.format(-Math.floor(elapsed / unit.ms), unit.name);
		}
	}

	return "just now";
}

function counter(icon: string, count: number, label: string): string {
	if (count === 0) return "";

	return `<span class="repo-meta-item">${icon}${count} <span class="sr-only">${label}</span></span>`;
}

function renderLanguage(language: string | null): string {
	if (!language) return "";

	const dot = `<span class="language-dot" style="background-color: ${languageColor(language)}"></span>`;

	return `<span class="repo-meta-item">${dot}${escape(language)}</span>`;
}

function renderHomepage(homepage: string | null): string {
	if (!homepage) return "";

	return `<p class="repo-homepage"><a href="${escape(href(homepage))}">${escape(homepage)}</a></p>`;
}

function renderRepo(repo: Repo, now: Date): string {
	const meta = [
		renderLanguage(repo.language),
		counter(ICONS.star, repo.stargazers_count, "stars"),
		counter(ICONS.repoForked, repo.forks_count, "forks"),
		repo.license ? `<span class="repo-meta-item">${escape(repo.license.spdx_id)}</span>` : "",
		`<span class="repo-meta-item">Updated ${escape(relativeTime(repo.pushed_at, now))}</span>`,
	];

	return `
				<li class="repo">
					<div class="repo-head">
						<h3 class="repo-name">
							<a href="${escape(repo.html_url)}">${escape(repo.name)}</a>
						</h3>
						<span class="label">Public</span>
					</div>
					<p class="repo-description">${escape(repo.description ?? "")}</p>
					${renderHomepage(repo.homepage)}
					<div class="repo-meta">
						${meta.filter(Boolean).join("\n\t\t\t\t\t\t")}
					</div>
				</li>`;
}

function renderSidebarItem(icon: string, content: string): string {
	return `<li class="sidebar-item">${icon}<span>${content}</span></li>`;
}

function renderHead(user: User, name: string): string {
	const title = `${name} · GitHub`;
	const description = user.bio ?? `Public work of @${user.login}`;

	return `
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>${escape(title)}</title>
		<meta name="description" content="${escape(description)}" />
		<meta property="og:title" content="${escape(title)}" />
		<meta property="og:description" content="${escape(description)}" />
		<meta property="og:image" content="${escape(user.avatar_url)}" />
		<meta property="og:url" content="${SITE_URL}" />
		<meta property="og:type" content="profile" />
		<link rel="icon" href="${escape(user.avatar_url)}" />
		<link rel="stylesheet" href="./styles.css" />`;
}

function renderSidebar(user: User, name: string): string {
	const followers = `<a href="${escape(user.html_url)}?tab=followers"><strong>${user.followers}</strong> followers</a>`;
	const following = `<a href="${escape(user.html_url)}?tab=following"><strong>${user.following}</strong> following</a>`;

	const details = [
		user.location ? renderSidebarItem(ICONS.location, escape(user.location)) : "",
		user.blog
			? renderSidebarItem(
					ICONS.link,
					`<a href="${escape(href(user.blog))}">${escape(user.blog)}</a>`
				)
			: "",
		renderSidebarItem(ICONS.people, `${followers} · ${following}`),
	];

	return `
			<aside class="sidebar">
				<img class="avatar" src="${escape(user.avatar_url)}" alt="" width="260" height="260" />
				<h1 class="fullname">${escape(name)}</h1>
				<p class="username">${escape(user.login)}</p>
				${user.bio ? `<p class="bio">${escape(user.bio)}</p>` : ""}
				<a class="btn" href="${escape(user.html_url)}">Follow on GitHub</a>
				<ul class="sidebar-details">
					${details.filter(Boolean).join("\n\t\t\t\t\t")}
				</ul>
			</aside>`;
}

function renderContent(repos: Repo[], now: Date): string {
	return `
			<section class="content">
				<nav class="tabnav" aria-label="Profile">
					<span class="tabnav-tab selected">
						Repositories <span class="counter">${repos.length}</span>
					</span>
				</nav>
				<ul class="repo-list">${repos.map((repo) => renderRepo(repo, now)).join("")}
				</ul>
			</section>`;
}

export function renderPage(user: User, repos: Repo[], now: Date): string {
	const name = user.name ?? user.login;

	return `<!doctype html>
<html lang="en">
	<head>${renderHead(user, name)}
	</head>
	<body>
		<header class="app-header">
			<a class="app-header-mark" href="${escape(user.html_url)}" aria-label="GitHub profile">${ICONS.mark}</a>
			<span class="app-header-title">${escape(user.login)}</span>
		</header>

		<main class="layout">${renderSidebar(user, name)}${renderContent(repos, now)}
		</main>

		<footer class="footer">
			Built from the GitHub API on
			<time datetime="${now.toISOString()}">${now.toISOString().slice(0, 10)}</time>
			·
			<a href="https://github.com/${USERNAME}/${USERNAME}.github.io">source</a>
		</footer>
	</body>
</html>
`;
}
