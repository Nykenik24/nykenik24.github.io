# Project notes

This is Andrei's personal site: a static Eleventy site that presents the
content as a five-volume compendium on a bookshelf.

## Commands

- `npm run dev` — local server with reload.
- `npm run build` — write the site to `_dist/`.

## Content

- `_data/books.json` defines the volumes: slug, numeral, title, band
  colour, spine width, and back-cover summary. The `width` values should
  add up to 100.
- `content/books/<slug>.md` holds the reading text for the volume with
  the same slug. `#` marks a chapter or blog title: it always starts a
  new page and is listed in the book's contents. Lower levels are
  ordinary sections inside the chapter.
- `_data/site.json` holds the site title and description.
- Drop a drawing at `assets/covers/<slug>.svg` to replace the generated
  noise plate. Without that file, two-colour noise is shown.

To add a volume, add an entry to `books.json` and a matching markdown
file. To remove one, delete both.

## Style

- Plain CSS, split by concern under `assets/css/`. Change colours and
  fonts in `theme.css` only.
- Plain JavaScript in `assets/js/main.js`. Keep it small and guarded by
  the elements it needs.
- Do not add comments unless a piece of logic is genuinely hard to
  follow.
- Avoid magic numbers in JavaScript; name the constants that matter.
- Keep markup in templates and data in JSON. Do not hardcode book text
  in layouts.
- Prefer CSS for visual effects. No animation libraries.
- `design/` is the approved mockup and is kept for reference. Do not
  change it unless the design changes.
