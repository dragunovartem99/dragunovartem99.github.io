# dragunovartem99.github.io

A GitHub-looking front page for my public repos, built from the GitHub API

## How it works

An [Astro](https://astro.build) site of exactly one page. `npm run build` fetches the profile, the
public repos and the per-repo language tallies of `dragunovartem99`, and renders `dist/` in GitHub's
own Primer colors (light and dark) — the page, and a favicon drawn from the avatar. No client-side
JavaScript, no runtime API calls, so the HTML is as fresh as the last deploy.

The sidebar bar is every language across those repos by share of bytes — what
`/repos/{owner}/{repo}/languages` reports, which costs one request per repo. Bytes are the closest
thing the API offers to lines of code.

A repo shows up when it is public, not a fork, not archived, and has a description — everything else
is considered work in progress.

## Featured work

`src/featured.ts` is the handpicked list on top of the page, in the order it is written. An entry is
either a repo reference, which fills its card from the GitHub API:

```ts
{ kind: "repo", name: "puzzfinder", tag: "Chess" }
```

or a project that lives anywhere at all — a site, a package, something that is not on GitHub — and is
described by hand:

```ts
{
	kind: "project",
	title: "dragunov.dev",
	description: "…",
	url: "https://dragunov.dev",
	tag: "Website",
	language: "TypeScript",
	links: [{ label: "Source", url: "https://github.com/…" }],
}
```

Featured repos are lifted out of the list below, and a repo reference the API does not return — a
fork, an archive, a rename — is skipped instead of breaking the build.

## Layout

| Path                 | Holds                                                       |
| -------------------- | ----------------------------------------------------------- |
| `src/pages`          | the page and the generated `favicon.svg`                    |
| `src/layouts`        | the document: head, header, footer                          |
| `src/components`     | the sidebar, the cards, the small pieces they are made of   |
| `src/modules/github` | the API calls, the linguist colors and the language tallies |
| `src/utils`          | date and URL formatting                                     |
| `src/styles`         | the Primer tokens and the reset; everything else is scoped  |

## Scripts

| Script        | Idea                                  |
| ------------- | ------------------------------------- |
| `dev`         | serve the page, rebuilt on every save |
| `build`       | fetch the data and write `dist/`      |
| `preview`     | serve the built `dist/`               |
| `test`        | run the unit tests                    |
| `format`      | format the sources                    |
| `lint`        | lint the sources                      |
| `types:check` | type-check the sources and templates  |

`GITHUB_TOKEN` is optional locally and raises the API rate limit when set.

## Deploy

Pushing to `main` deploys to GitHub Pages via [pipes](https://github.com/dragunovartem99/pipes). A
daily cron rebuilds the page so the repo list stays current.
