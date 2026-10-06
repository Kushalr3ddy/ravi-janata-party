# Ravi Janata Party (RJP) website

Static site (HTML/CSS/JS, no build). English by default with a Kannada toggle.

## Run locally
```
python3 -m http.server 8000
```
Open http://localhost:8000

## Deploy on GitHub Pages
1. Push this folder to a GitHub repo (branch `main`).
2. Repo, Settings, Pages, Source: "Deploy from a branch", `main` / root.
3. The site appears at `https://<user>.github.io/<repo>/`.

## Things to replace
- `js/main.js`: `FORM_ENDPOINT` (create a free form at formspree.io and paste its URL; until then the Join form shows "not connected yet") and `VIDEO_ID`.
- `js/i18n.js`: all copy. The Kannada text is a draft and needs review by a native speaker.
- `assets/logo.svg`: placeholder logo. Colours are CSS variables at the top of `css/style.css`.
- Leadership cards in `index.html` are placeholders.
- `reference content/` holds banners for MSM TV and Mahasaraswathi Education Foundation. They were used as style reference only and are not shown on the site. RJP-specific banners are still needed.

## Note on the video
The home page video is a third-party "Troll Patrike" video about Congress. The creator can remove it at any time, and it targets a rival party, so consider replacing it with an RJP video (set `VIDEO_ID`).
