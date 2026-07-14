# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single static web app: `Quotes/quote-generator/index.html` (a Random Quote Generator with inline CSS/JS). There is no `package.json`, build step, test suite, or lint config, and no runtime dependencies to install.

- Run (dev): serve the folder as static files, e.g. `python3 -m http.server 8000` from `Quotes/quote-generator`, then open `http://localhost:8000/index.html`. Python 3 is preinstalled.
- Build: none. The app is plain HTML/CSS/JS opened directly in a browser.
- Test/lint: none configured. Verify changes by loading the page and clicking "New quote" to confirm the quote/author updates.
- Google Fonts are loaded from a CDN; if the cloud VM has restricted egress the page still works with fallback fonts.
