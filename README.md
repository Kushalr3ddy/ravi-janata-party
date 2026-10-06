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
- `js/main.js`: `FORM_ENDPOINT` (create a free form at formspree.io and paste its URL; until then the Join form shows "not connected yet").
- `js/i18n.js`: all copy. The Kannada text is a draft and needs review by a native speaker.
- `assets/logo.svg`: placeholder logo. Colours are CSS variables at the top of `css/style.css`.
- `reference content/` holds banners for MSM TV and Mahasaraswathi Education Foundation. They were used as style reference only and are not shown on the site. RJP-specific banners are still needed.


## Pages and how they are built
Pages: `index` (home), `about`, `stand` (what we stand for), `inspiration`, `pledges`, `join`, `vision`.

The `.html` files in the project root are **generated**. Edit the sources instead, then rebuild:
- `src/pages/<name>.html`: the content of each page (a few `key: value` lines, `---`, then the page body)
- `src/partials/header.html`, `src/partials/footer.html`: the shared header and footer
- `src/layout.html`: the shared `<head>` and scripts

```
python3 tools/build.py
```
Commit the generated files too (GitHub Pages serves them as they are). All visible text lives in `js/i18n.js`
(English and Kannada); pages reference it with `data-i18n="key"`.

## Languages
The menu at the top has English and Kannada, which are written by us (`js/i18n.js`), plus 21 other Indian languages
that use Google Website Translator on our English text. Those are machine translations (the page says so), they load
a script from Google, and they set a `googtrans` cookie. Have a native speaker check English and Kannada before launch.

## Branding
`assets/rjp-logo.svg` is a vector version of the RJP logo, traced from Ravi's poster by `tools/trace_logo.py` (the Ashoka
wheel is redrawn as exact geometry). `assets/rjp-logo.png` is the source cut-out; `assets/rjp-lockup.png` (logo with name
and tagline) is used for link previews. If Ravi has the original vector logo, drop it in as `assets/rjp-logo.svg`.
The brand spelling on his posters is "Ravi Janatha Party".
