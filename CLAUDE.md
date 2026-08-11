# CLAUDE.md

## Code style

- DO use `type X = {}` aliases, NOT `interface` (sole exception: global declaration merging, e.g. `env.d.ts`)
- DO take a single object parameter instead of 2+ positional arguments
- DO NOT add lint-disable comments — restructure the code until the linter passes
- DO NOT use non-null assertions (`!`) — narrow the type instead
- DO use `//` comments on functions that take parameters or return a value — `oxlint`'s jsdoc rules demand `@param`/`@returns` from every `/** */` block, and those tags restate the signature
- DO reserve `/** */` for types, consts, parameterless functions, and the file-level blurb — put that blurb above the imports, or it attaches to the first declaration below it

## Structure

- DO keep `src/modules/github` self-contained: `utils/`, `types.ts`, and an `index.ts` barrel exporting only the public surface
- DO NOT import a module's internals (`utils/`) from outside the module
- DO put shared page furniture in `src/components/`, page-specific markup and layout in the page itself
- DO keep everything the page is handpicked from in `src/featured.ts` and `src/constants.ts` — no site content inside components

## Data

- DO fetch from the GitHub API at build time only — the page ships no client JavaScript and makes no runtime request
- DO reach the API through `src/modules/github`, which sends `GITHUB_TOKEN` when the environment has one
- DO let a missing repo drop its card rather than fail the build; a failing request is a build error and should stay one

## Tests

- DO colocate tests with what they cover: `<dir>/__tests__/<name>.test.ts`, next to the `utils/` they exercise
- DO test the pure helpers — formatting, tallies — and not the API calls or the markup

## Styling

- DO use the tokens in `src/styles/tokens.css` — no raw hex values outside it, except linguist's own language colors
- DO scope styles with the `<style>` block inside each `.astro` file; `global.css` is for the reset and the handful of primitives that belong to no component
- DO give a component every style it needs — an Astro scoped selector never reaches inside a child component, so style through props and wrappers, not `:global()`
- DO keep the page readable in light and dark: colors come from `light-dark()` in the tokens
