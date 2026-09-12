import type { ProfileView, User } from "../../types.ts";

// The profile payload turned into what the sidebar and the document head print
export function mapProfile({ user }: { user: User }): ProfileView {
	return {
		avatarUrl: user.avatar_url,
		bio: user.bio,
		followers: user.followers,
		following: user.following,
		location: user.location,
		login: user.login,
		name: user.name ?? user.login,
		url: user.html_url,
	};
}
