# 3.14 Second Challenge

A tiny web game: start and stop the chronometer with Space to land exactly at 3.14 seconds.

- Unlock clue (first run only): REGIARDO
- Success sign on perfect hit: PAIS CALES

## Files
- `index.html`
- `styles.css`
- `script.js`

## Run locally
1. Open `index.html` in your browser.
2. Enter the unlock clue `REGIARDO`.
3. Press Space to start/stop; aim for `3.14 s` (display shows 2 decimals).

## Push to GitHub
This repo is prepared locally. Add a remote and push:

```bash
# Create a new empty repo on GitHub (via web UI) named for example: chronometer-3.14s-game
# Then run the following from this folder:

git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git push -u origin main
```

Alternatively, with GitHub CLI (requires `gh auth login`):

```bash
gh repo create <YOUR_REPO> --public --source=. --remote=origin --push
```
