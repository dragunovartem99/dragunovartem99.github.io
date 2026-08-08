export const USERNAME = "dragunovartem99";

export const SITE_URL = `https://${USERNAME}.github.io`;

/** Personal site, kept here because the GitHub profile does not carry it */
export const WEBSITE_URL = "https://dragunov.dev";

/** Repos listed here are never shown, whatever the API says */
export const HIDDEN_REPOS = new Set([
	// The profile README
	USERNAME,
	// This page listing itself
	`${USERNAME}.github.io`,
]);
