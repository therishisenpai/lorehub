# LoreHub

**LoreHub** is a static, browser-based fandom knowledge prototype covering three fictional universes: **Bleach**, **Tekken**, and **Resident Evil**.

It is an original student project inspired by community wiki platforms. It is not affiliated with Fandom or the owners of the featured franchises.

## Current features

- Three universe landing cards with descriptions and entry points.
- Search across article titles, summaries, categories and article text.
- Filter by universe or saved articles.
- Sort articles by featured, title, or universe.
- Structured article detail pages with facts and related entries.
- Save and remove bookmarks using browser `localStorage`.
- Submit article suggestions through a form; submissions are stored locally in the current browser.
- Responsive layout for desktop and mobile.

## Run locally

No build step or package installation is required.

1. Download or clone the repository.
2. Open `index.html` in a modern browser.
3. For a local web server, run `python -m http.server 8000` from the project folder and visit `http://localhost:8000`.

## Project structure

```text
lorehub/
├── assets/
│   └── favicon.svg
├── app.js          # UI rendering, search, filters, bookmarks and form logic
├── data.js         # Curated demo universe and article data
├── index.html      # Application shell and page structure
├── styles.css      # Responsive visual system
└── README.md
```

## Prototype limitations

- Data is a curated local sample, not a complete fandom database.
- Bookmarks and submissions are stored in the current browser only; they do not sync between users or devices.
- The contribution form is a local prototype and does not publish community edits.
- There is no authentication, moderation backend, or remote database yet.
- Search runs against the included local article dataset.

## Suggested next milestones

1. Add a backend API and database for articles and user accounts.
2. Add moderation and revision history for community submissions.
3. Add richer character relationship views and category navigation.
4. Add deployment and usability testing.

## License and franchise note

The code in this repository is intended as an educational prototype. Franchise names and references are used to identify the fictional universes represented. LoreHub is an independent fan-made project and does not claim ownership of third-party intellectual property. Add original or appropriately licensed artwork before public commercial use.
