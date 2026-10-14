# Projects

Each folder here is one case study, shown as a `project` node under **Projects** on the canvas.

## Add a project

1. Copy `_template/` to a new folder named after the project id, e.g. `my-game/`.
2. Fill in `index.js`. Empty sections are hidden, so fill them in as you go.
3. Put screenshots and GIFs in the same folder and import them:
   ```js
   import demoGif from './demo.gif';
   // ...
   media: [{ src: demoGif, alt: 'Player joining a match', caption: 'Two clients in sync' }],
   ```
4. Import it in `index.js` and add it to the `projects` array.
5. When it's ready, set `status: 'published'` to remove the "in progress" note.

Positions and connection lines are generated automatically under the Projects node.

`code` takes public repo URLs, one per entry. Private repos go in `sourceRepos`, which is for your reference and never shown.
