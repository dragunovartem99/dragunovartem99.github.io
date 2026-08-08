// Small HTML helpers shared by the page sections
import { languageColor } from "./languages.ts";

const ESCAPES: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};

export function escape(value: string): string {
	return value.replaceAll(/[&<>"']/gu, (char) => ESCAPES[char] ?? char);
}

export function href(url: string): string {
	return url.startsWith("http") ? url : `https://${url}`;
}

// Link text, not a link: the scheme, the query and a runaway path are noise
export function clean(url: string, limit = 44): string {
	const bare = url
		.replace(/^https?:\/\//u, "")
		.replace(/^www\./u, "")
		.replace(/[?#].*$/u, "")
		.replace(/\/$/u, "");

	return bare.length > limit ? `${bare.slice(0, limit - 1)}…` : bare;
}

const UNITS = [
	{ name: "year", ms: 365 * 24 * 60 * 60 * 1000 },
	{ name: "month", ms: 30 * 24 * 60 * 60 * 1000 },
	{ name: "week", ms: 7 * 24 * 60 * 60 * 1000 },
	{ name: "day", ms: 24 * 60 * 60 * 1000 },
	{ name: "hour", ms: 60 * 60 * 1000 },
	{ name: "minute", ms: 60 * 1000 },
] as const;

export function relativeTime(iso: string, now: Date): string {
	const elapsed = now.getTime() - new Date(iso).getTime();
	const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

	for (const unit of UNITS) {
		if (elapsed >= unit.ms) {
			return formatter.format(-Math.floor(elapsed / unit.ms), unit.name);
		}
	}

	return "just now";
}

export function counter(icon: string, count: number, label: string): string {
	if (count === 0) return "";

	return `<span class="meta-item">${icon}${count} <span class="sr-only">${label}</span></span>`;
}

export function languageMeta(language: string | null): string {
	if (!language) return "";

	const dot = `<span class="language-dot" style="background-color: ${languageColor(language)}"></span>`;

	return `<span class="meta-item">${dot}${escape(language)}</span>`;
}

export function tag(label: string | undefined): string {
	if (!label) return "";

	return `<span class="tag">${escape(label)}</span>`;
}
