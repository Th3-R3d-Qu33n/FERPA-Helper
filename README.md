# FERPA Helper — Auto Deploy via GitHub Actions

Deployed at: https://th3-r3d-qu33n.github.io/FERPA-Helper/

## One-time setup
1. Push this repo to GitHub as `FERPA-Helper`.
2. In **Settings → Pages**, set **Source = GitHub Actions**.
3. Ensure your default branch is `main`.

## How it works
- On every push to `main`, GitHub Actions will:
  - `npm ci`
  - `npm run build` (Vite)
  - Publish the `dist/` artifact to GitHub Pages

## Local Dev
```bash
npm i
npm run dev
```

## Replace sample data
Overwrite `src/data/` with your full dataset:
- nodes.json
- chunks.json
- vectors.index.json
- vectors.bin
