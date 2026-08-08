# dragunovartem99.github.io

Personal landing page that looks like GitHub and builds itself from the GitHub API

## How it works

`npm run build` fetches the profile and the public repos of `dragunovartem99`, renders a static
`dist/index.html` in GitHub's own Primer colors (light and dark), and copies the stylesheet next to
it. No client-side JavaScript, no runtime API calls.

A repo shows up when it is public, not a fork, not archived, and has a description — everything else
is considered work in progress.

## Scripts

| Script        | Idea                               |
| ------------- | ---------------------------------- |
| `build`       | fetch the data and write `dist/`   |
| `preview`     | open the built page in the browser |
| `format`      | format the sources                 |
| `lint`        | lint the sources                   |
| `types:check` | type-check without emitting        |

`GITHUB_TOKEN` is optional locally and raises the API rate limit when set.

## Deploy

Pushing to `main` deploys to GitHub Pages via [pipes](https://github.com/dragunovartem99/pipes). A
daily cron rebuilds the page so the repo list stays current.
