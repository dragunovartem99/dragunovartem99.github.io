/** Whole API payloads, so a test only has to spell out the field it is about */

import type { Repo, User } from "../../../types.ts";

export function repo(overrides: Partial<Repo> = {}): Repo {
	return {
		archived: false,
		description: "A thing that does a thing",
		fork: false,
		forks_count: 0,
		homepage: null,
		html_url: "https://github.com/dragunovartem99/layr",
		language: "TypeScript",
		license: null,
		name: "layr",
		pushed_at: "2026-01-09T12:00:00Z",
		stargazers_count: 0,
		topics: [],
		...overrides,
	};
}

export function user(overrides: Partial<User> = {}): User {
	return {
		avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
		bio: "Chess and tooling",
		company: null,
		followers: 12,
		following: 5,
		html_url: "https://github.com/dragunovartem99",
		location: "Tbilisi",
		login: "dragunovartem99",
		name: "Artem Dragunov",
		...overrides,
	};
}
