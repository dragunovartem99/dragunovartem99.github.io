import { describe, expect, it } from "vitest";

import { mapProfile } from "../mapProfile.ts";
import { user } from "./fixtures.ts";

describe("mapProfile", () => {
	it("renames the payload into what the sidebar prints", () => {
		const view = mapProfile({ user: user() });

		expect(view).toEqual({
			avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
			bio: "Chess and tooling",
			followers: 12,
			following: 5,
			location: "Tbilisi",
			login: "dragunovartem99",
			name: "Artem Dragunov",
			url: "https://github.com/dragunovartem99",
		});
	});

	it("falls back to the login when the profile carries no name", () => {
		const view = mapProfile({ user: user({ name: null }) });

		expect(view.name).toBe("dragunovartem99");
	});
});
