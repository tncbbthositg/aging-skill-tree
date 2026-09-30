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

Google Fonts supplies DM Sans and Space Grotesk; system sans-serif fonts are the fallback. No analytics, API keys, or personal data are included. Sharing copies only the page URL and age. This scaffold has no license grant yet; choose a license before accepting outside contributions or encouraging reuse.
