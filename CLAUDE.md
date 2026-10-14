# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site built with Create React App (`react-scripts` 5, React 18), deployed to GitHub Pages. It's styled as a low-code canvas: each section or project is a block you can open. Keep it on Create React App (no Vite migration), and keep the canvas hand-rolled with minimal dependencies (no React Flow).

## Architecture

- `src/data/blocks.js` builds the canvas content: the `blocks` array (id, kind, title, subtitle, a position for each layout, and JSX `content` shown when opened) and `edges` (pairs of block ids). The profile and resume blocks are written by hand. Project blocks, their positions (two per row under Projects) and their edges are generated from `src/projects`.
- `src/projects/<id>/index.js` holds one case study (problem, tools, media, code, snippet, demo, `status`), and `src/projects/index.js` registers them in canvas order. To add a project, copy `_template/` (see `src/projects/README.md`). `CaseStudy.js` renders a project in the panel and hides empty sections. `sourceRepos` lists the private repos a case study is based on and is never rendered, so only link public repos in `code`.
- `src/canvas/Canvas.js` wraps the world in `react-zoom-pan-pinch` (`TransformWrapper`) for pan, zoom and pinch, draws edges as an SVG layer, and positions blocks absolutely. It picks the `pos` layout or the compact `mobilePos` layout at `MOBILE_BREAKPOINT`, and computes the initial scale so the whole world fits. A click capture handler drops clicks that end more than `DRAG_THRESHOLD` px from where the pointer went down, so panning doesn't open blocks.
- `src/canvas/layout.js` holds the fixed block size (`BLOCK_W`/`BLOCK_H`, which edge geometry depends on) and the edge routing. An edge leaves from the side facing its target along the dominant axis and is drawn as a cubic bezier.
- `src/canvas/Panel.js` shows an opened block's content: a side drawer on desktop, full screen on phones. Escape or the backdrop closes it.

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
