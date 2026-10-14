# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site built with Create React App (`react-scripts` 5, React 18), deployed to GitHub Pages. The app is still close to the CRA starter template: `src/App.js` is the single component, and `src/App.test.js` is the only test.

## Commands

- `npm start`: dev server at http://localhost:3000
- `npm run build`: production build into `build/`
- `npm test`: Jest + React Testing Library in watch mode. For a single non-interactive run, use `npm test -- --watchAll=false`. To run one test, use `npm test -- --watchAll=false -t "<test name>"` or pass a file path pattern.

Linting comes from CRA's built-in ESLint config (`react-app`, `react-app/jest` in `package.json`). It runs during `start` and `build`. There's no separate lint script.

## CI and deployment

- `.github/workflows/node.js.yml` runs `npm ci`, `npm run build` and `npm test` on Node 18/20/22 for every push and PR to `main`.
- `.github/workflows/deploy.yml` deploys to GitHub Pages on every push to `main`. It runs the tests, builds, and publishes `build/` with `actions/deploy-pages`. The repo's Pages source must be set to *GitHub Actions*. The old `gh-pages` branch and npm package aren't used anymore.
- Both workflows set `CI=true`, so `npm test` runs once instead of watching.
- The site is a GitHub user site served from the root (https://mauropalgi.github.io/), so `homepage` in `package.json` must stay `https://MauroPalgi.github.io`. A subpath there breaks asset URLs.
- Static assets that should be served as-is go in `public/`. `public/index.html` is the HTML shell that the React app mounts into (`#root`).
