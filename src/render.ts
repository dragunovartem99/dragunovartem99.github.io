import { SITE_URL, USERNAME, WEBSITE_URL } from "./config.ts";
import type { LanguageBytes, Repo, User } from "./github.ts";
import { clean, escape } from "./html.ts";
import { ICONS } from "./icons.ts";
import { renderFeatured, renderRepos } from "./sections.ts";
import { type LanguageSlice, languageBreakdown } from "./stats.ts";

/* Sidebar */

function sidebarItem(icon: string, content: string): string {
	return `<li class="sidebar-item">${icon}<span>${content}</span></li>`;
}

function share(slice: LanguageSlice): string {
	return `${slice.percent.toFixed(1)}%`;
}

function renderLanguages(slices: LanguageSlice[]): string {
	if (slices.length === 0) return "";

	const bar = slices
		.map(
			(slice) =>
				`<span class="lang-slice" style="width: ${slice.percent.toFixed(2)}%; background-color: ${slice.color}" title="${escape(slice.language)} ${share(slice)}"></span>`
		)
		.join("");

	const legend = slices
		.map(
			(slice) =>
				`<li class="lang-item"><span class="language-dot" style="background-color: ${slice.color}"></span>${escape(slice.language)} <span class="lang-share">${share(slice)}</span></li>`
		)
		.join("");

	return `
				<div class="languages">
					<h2 class="sidebar-title">Languages</h2>
					<div class="lang-bar">${bar}</div>
					<ul class="lang-legend">${legend}</ul>
				</div>`;
}

function renderSidebar(user: User, bytes: LanguageBytes, name: string): string {
	const followers = `<a href="${escape(user.html_url)}?tab=followers"><strong>${user.followers}</strong> followers</a>`;
	const following = `<a href="${escape(user.html_url)}?tab=following"><strong>${user.following}</strong> following</a>`;

	const details = [
		user.location ? sidebarItem(ICONS.location, escape(user.location)) : "",
		sidebarItem(ICONS.people, `${followers} · ${following}`),
	];

	const website = `<a class="btn" href="${WEBSITE_URL}">${ICONS.globe}${escape(clean(WEBSITE_URL))}</a>`;

	return `
			<aside class="sidebar">
				<div class="avatar-frame">
					<img class="avatar" src="${escape(user.avatar_url)}" alt="" width="260" height="260" />
				</div>
				<h1 class="fullname">${escape(name)}</h1>
				<p class="username">${escape(user.login)}</p>
				${user.bio ? `<p class="bio">${escape(user.bio)}</p>` : ""}
				<div class="actions">
					<a class="btn btn-primary" href="${escape(user.html_url)}">${ICONS.mark}Follow on GitHub</a>
					${website}
				</div>
				<ul class="sidebar-details">
					${details.filter(Boolean).join("\n\t\t\t\t\t")}
				</ul>
				${renderLanguages(languageBreakdown(bytes))}
			</aside>`;
}

/* Page */

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
		<link rel="icon" href="./favicon.svg" type="image/svg+xml" />
		<link rel="apple-touch-icon" href="${escape(user.avatar_url)}" />
		<link rel="stylesheet" href="./styles.css" />`;
}

function renderHeader(user: User): string {
	const links = [
		{ href: "#featured", label: "Featured" },
		{ href: "#repositories", label: "Repositories" },
	];

	const nav = links
		.map((link) => `<a class="app-nav-link" href="${link.href}">${link.label}</a>`)
		.join("");

	return `
		<header class="app-header">
			<a class="app-header-mark" href="${escape(user.html_url)}" aria-label="GitHub profile">${ICONS.mark}</a>
			<span class="app-header-title">${escape(user.login)}</span>
			<nav class="app-nav" aria-label="Sections">${nav}</nav>
		</header>`;
}

export function renderPage(user: User, repos: Repo[], bytes: LanguageBytes, now: Date): string {
	const name = user.name ?? user.login;

	const content = [renderFeatured(repos), renderRepos(repos, now)].filter(Boolean).join("\n");

	return `<!doctype html>
<html lang="en">
	<head>${renderHead(user, name)}
	</head>
	<body>${renderHeader(user)}

		<main class="layout">${renderSidebar(user, bytes, name)}
			<div class="content">
${content}
			</div>
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
