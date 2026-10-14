# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site built with Create React App (`react-scripts` 5, React 18), deployed to GitHub Pages. It's styled as a low-code canvas: every section or project is a typed node you can open, edit, move or delete, and visitors can add their own from the Nodes palette. Keep it on Create React App (no Vite migration), and keep the canvas hand-rolled with minimal dependencies (no React Flow).

## Architecture

- **Node model.** Everything on the canvas is a node `{ id, type, parent, title, subtitle, ...type config }`. `parent` is the node it's connected to: connection lines, desktop/mobile positions, and PDF order are all derived from that tree. There's no separate edges list and no hand-written coordinates.
- `src/canvas/nodeTypes.js` is the type registry (profile, text, list, link, project, pdf). Each type has `label`, `palette` (offered in the Nodes panel), `defaults`, `fields` (edit form inputs: text, textarea, lines, csv, select) and `render(node)`, which both the panel and the PDF export use. To add a node type, add an entry here. `content.js` has helpers (`clean`, `linkFor`). Only http(s) and email links are rendered as links, because visitors can type arbitrary values.
- `src/data/diagram.js` is the starting canvas (`initialNodes`), listed in tree order and built from resume content. Project nodes come from `src/projects`.
- `src/projects/<id>/index.js` holds one case study (problem, tools, media, code URLs, snippet, demo, `status`), and `src/projects/index.js` registers them. To add one, copy `_template/` (see `src/projects/README.md`). `CaseStudy.js` renders project nodes and hides empty sections. `sourceRepos` lists the private repos a case study is based on and is never rendered.
- `src/canvas/layout.js`: `autoLayout` gives each node a desktop `pos` (root on top, its children as columns, deeper nodes stacked and indented) and a mobile `mobilePos` (an indented outline). `treeOrder` gives depth-first order. `edgePath` draws an elbow line for an indented child just below its parent, a vertical bezier when there's vertical room, and a horizontal bezier otherwise. `BLOCK_W`/`BLOCK_H` are fixed, and the edge geometry depends on them.
- `src/canvas/Canvas.js` owns the `nodes` state (session only, and "Reset canvas" restores `initialNodes`). It wraps the world in `react-zoom-pan-pinch`, with a `ref` used for `clientToContent` and the current zoom level. It renders blocks and the SVG edges, and handles add, update, move and delete. Deleting a node disconnects its children rather than deleting them. Nodes move by their ⠿ handle (`.block__grip`, excluded from panning), with deltas divided by the zoom level, and the move only updates the current layout's position key. A click capture handler drops clicks that end more than `DRAG_THRESHOLD` px from the pointerdown, so panning doesn't open nodes.
- `src/canvas/NodePanel.js` shows a node in `Panel.js` (a drawer on desktop, full screen on phones): the rendered content or `NodeForm.js` (live edits plus a "Connected to" parent select that excludes the node's own subtree), plus Edit/Done and Delete node buttons. Newly dropped nodes open in edit mode.
- `src/canvas/Palette.js` is a left sidebar on desktop (the canvas is offset by `SIDEBAR_W`) and a collapsible menu on phones. Items are dragged with pointer events (so touch works), with drag state in a ref, and dropped at `clientToContent`, or added at the view's center on click.
- `src/canvas/pdf.js` (the Download PDF node) renders each node's `render()` with `renderToStaticMarkup`, walks the HTML (h3, p, ul, `ul.tags`, pre, figure) into a jsPDF text document, and maps text to Latin-1, the only character set jsPDF's built-in fonts support. jsPDF and `react-dom/server` are loaded with dynamic `import()`. `src/setupTests.js` polyfills `TextEncoder` for jsPDF under jsdom.
- Wheel zoom is additive (`scale += step * |deltaY|`), so `WHEEL_STEP` in Canvas.js must stay small. The library default of 0.015 jumps +1.5 per mouse wheel notch.
- `npm run build` with `CI=true` (as GitHub Actions runs it) treats ESLint warnings as errors, including `react-hooks/exhaustive-deps`, so a warning that's harmless locally breaks the deploy. Check with `CI=true npm run build` before pushing.

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
