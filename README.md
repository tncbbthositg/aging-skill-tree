# Aging Skill Tree

Another year older. Another questionable ability. An interactive, intentionally ridiculous RPG skill tree about getting older, built with React + TypeScript + Vite + Tailwind CSS. All ages are fictional joke thresholds.

## Run locally

Node 24 LTS recommended (minimum 22.12). Use Yarn 1.22.22, pinned in `package.json`. If Yarn is not installed, run `corepack enable` first.

```sh
yarn install --frozen-lockfile
yarn dev
```

```sh
yarn format:check
yarn typecheck
yarn test
yarn build
yarn preview
```

## What's inside

- 29 abilities in Structural Integrity, Sensor Calibration, and Recovery & Maintenance.
- Age slider from 20–80, starting at 45; age-based unlocks and a legendary synergy.
- SVG connecting paths and icons with CSS/HTML skill cards. No image assets or backend required.
- Keyboard-operable controls, tap-to-inspect descriptions, discipline filters, reduced motion support.
- Shareable `?age=45` URLs with copy fallback. No account or storage required.

Strict TypeScript checking covers the app, skill data, tests, and Vite configuration. `yarn build` runs the type checker before bundling; the Pages workflow runs the same build. Shared domain and component styling types live in `src/types.ts`.

Run `yarn format` to format source, styles, tests, configuration, and documentation with Prettier. `yarn format:check` verifies formatting without editing files and also runs in CI.

## Code style

Follow [Airbnb’s JavaScript whitespace conventions](https://github.com/airbnb/javascript#whitespace) and [React/JSX guide](https://github.com/airbnb/javascript/tree/master/react), supplemented by [Google’s TypeScript guide](https://google.github.io/styleguide/tsguide.html) for type-only imports and type declarations. Local conventions take precedence where these guides differ: retain function components with hooks, default component exports, and the existing Prettier configuration.

- Keep imports at the top, separating external dependencies, local modules, and stylesheet imports.
- Use one blank line between top-level declarations and logical blocks: state, derived values, effects, handlers, guards, and rendering. Keep closely related declarations together.
- Separate substantial JSX sibling regions with a blank line, without adding whitespace expressions to rendered content.
- Use braces for control flow and one variable declaration per statement.
- Use TypeScript props and domain types; keep type-only imports explicit.
- Run `yarn format:check` before finishing. Prettier handles mechanical formatting and preserves these intentional blank lines; logical grouping is a review convention.

The selected-skill details panel derives its accent from the owning discipline’s `color`, the same source used by the tree cards.

## Expand the tree

Edit `src/skills.ts`: each discipline has a name, subtitle, color, icon and skills. Each skill has a unique ID, unlock age, title, description, icon, optional parent IDs and ability type. Parents must refer to earlier skills in the same discipline; they define visual connections, not additional unlock conditions. Age is the only unlock requirement.

Add SVG icons in `src/components/Icon.tsx`. `SkillTree.tsx` draws the data; `main.tsx` owns age, selection, filters and sharing; Tailwind utility classes in the components handle layout and responsive states. `style.css` contains the Tailwind import, font theme, global defaults, and browser-specific range thumbs. The selected-skill panel always shows the full description when a card excerpt is truncated. Shared age input is validated and clamped. Legendary requirements are listed separately in `legendaryIds`.

## GitHub Pages

1. Create the approved repository and push this project to its `main` branch.
2. In **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
3. Run **Check and deploy to GitHub Pages** from Actions (or push to `main`).

The workflow tests and builds pull requests without deploying; pushes to `main` build and deploy. It uses minimal job permissions and the `github-pages` environment. `vite.config.ts` uses relative asset paths (`base: './'`) so the site works under a repository subpath and in local previews. There are no client-side routes requiring server rewrites.

Expected URL for the proposed repository: https://tncbbthositg.github.io/aging-skill-tree/

Deployment reference: https://vite.dev/guide/static-deploy.html#github-pages

## Design notes

Spacing follows [Material UI’s spacing guide](https://mui.com/material-ui/customization/spacing/) and its recommended 8px scale, expressed with Tailwind utilities (4 = 16px, 6 = 24px, 8 = 32px). Use 16px between related controls, 24px card padding, 32px between skill cards, and 48–64px between major sections. Mobile cards use 16px padding; discipline columns stack at 1100px so content retains breathing room. Keep spacing in rem-based utilities so it scales with the age-based text enlargement.

Google Fonts supplies DM Sans and Space Grotesk; system sans-serif fonts are the fallback. No analytics, API keys, or personal data are included. Sharing copies only the page URL and age. This scaffold has no license grant yet; choose a license before accepting outside contributions or encouraging reuse.
