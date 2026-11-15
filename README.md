# LoreHub

**LoreHub** is a static, browser-based fan knowledge prototype with a late-1990s / early-2000s arcade-inspired visual identity. It currently covers three fictional universes: **Bleach**, **Tekken**, and **Resident Evil**.

The visual system uses original, hand-authored pixel-art SVG illustrations and a retro arcade interface treatment. It does not use official game screenshots, logos, or character artwork.

## Current features

- Three universe landing cards with original pixel-art artwork and descriptions.
- Search across article titles, summaries, categories and article text.
- Filter by universe or saved articles.
- Sort articles by featured, title, or universe.
- Structured article detail pages with facts and related entries.
- Save and remove bookmarks using browser `localStorage`.
- Submit article suggestions through a form; submissions are stored locally in the current browser.
- Sticky navigation with scroll-aware active section state.
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
│   ├── arcade-hero.svg
│   ├── bleach-pixel.svg
│   ├── tekken-pixel.svg
│   ├── resident-evil-pixel.svg
│   └── favicon.svg
├── app.js          # UI rendering, search, filters, bookmarks and form logic
├── data.js         # Curated demo universe and article data
├── index.html      # Application shell and page structure
├── styles.css      # Retro arcade visual system and responsive styles
└── README.md
```

## Prototype limitations

- Data is a curated local sample, not a complete fandom database.
- Bookmarks and submissions are stored in the current browser only; they do not sync between users or devices.
- The contribution form is a local prototype and does not publish community edits.
- There is no authentication, moderation backend, or remote database yet.
- Search runs against the included local article dataset.

## License and franchise note

The code and original SVG illustrations in this repository are intended as an educational prototype. Franchise names and references are used to identify the fictional universes represented. LoreHub is an independent fan-made project and does not claim ownership of third-party intellectual property. Add original or appropriately licensed artwork before any public commercial use.


## Arcade Edition visual update

The Arcade Edition adds a curated game shelf featuring The King of Fighters '97, Castlevania: Order of Ecclesia, Mega Man Zero, Final Fantasy V, Tekken and Resident Evil. The Bleach, Tekken and Resident Evil archive sections remain available below.

Artwork in `assets/` was supplied by the project owner and is used as illustrative franchise/game imagery in this student prototype. LoreHub is an independent fan-made project and is not affiliated with the respective rights holders.

The game shelf is a visual discovery section. The existing searchable article archive, universe filters, article detail view, bookmarks and local contribution form remain part of the application.


## Follow-up polish

- The hero heading and eyebrow now use the requested anime/games/peak wording.
- The Bleach franchise card displays only the Bleach logo.
- The Resident Evil franchise card uses its contained logo artwork, matching the visual treatment of the classics aisle card.
- Castlevania: Order of Ecclesia artwork is bottom-aligned in its card frame to reveal more of the lower gameplay image.
- Franchise cards now say "STEP IN." and smoothly scroll to the database while applying the corresponding filter.
