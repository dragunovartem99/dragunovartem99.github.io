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
is considered work in progress. `HIDDEN_REPOS` in `src/constants.ts` drops the rest by name, the
profile README among them. This repo is not on that list: the page lists itself, like everything
else it found.

## Featured work

The cards on top of the page are the repos pinned on the GitHub profile, in the order the profile
shows them — pin, unpin or reorder there, and the next build follows. A card links to the repo's
homepage when it has one, with the code under "Source", and takes its text from the repo
description. Featured repos are lifted out of the list below, and a pin the page would not show
anyway — hidden, archived, undescribed — is skipped.

Pins are only exposed through the GraphQL API, which takes no anonymous requests, so the build
needs `GITHUB_TOKEN`. The deploy workflow passes its own; locally, borrow the GitHub CLI's:

```sh
GITHUB_TOKEN=$(gh auth token) npm run dev
```

## Layout

| Path                 | Holds                                                       |
| -------------------- | ----------------------------------------------------------- |
| `src/pages`          | the page and the generated `favicon.svg`                    |
| `src/layouts`        | the document: head, header, footer                          |
| `src/components`     | the sidebar, the cards, the small pieces they are made of   |
| `src/modules/github` | the API calls, the linguist colors and the language tallies |
| `src/utils`          | date and URL formatting                                     |
| `src/styles`         | the Primer tokens and the reset; everything else is scoped  |
| `src/constants.ts`   | the account, the URLs and the hidden repos                  |

Site content lives in that last file, never inside a component. Tests sit next to what they
cover, in `__tests__` beside the `utils/` they exercise.

## Scripts

| Script        | Idea                                  |
| ------------- | ------------------------------------- |
| `dev`         | serve the page, rebuilt on every save |
| `build`       | fetch the data and write `dist/`      |
| `preview`     | serve the built `dist/`               |
| `test`        | run the unit tests                    |
| `format`      | format the sources                    |
| `lint`        | lint the sources, fixing what it can  |
| `types:check` | type-check the sources and templates  |

`format:check` and `lint:check` are the same passes without the writes — what CI runs.

`GITHUB_TOKEN` is optional locally and raises the API rate limit when set.

## Deploy

Pushing to `main` deploys to GitHub Pages via [pipes](https://github.com/dragunovartem99/pipes). A
daily cron rebuilds the page so the repo list stays current.
