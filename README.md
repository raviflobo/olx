# CARONSELL

A car dealer marketplace built on the [OLX clone](https://github.com/sijeeshmiziha/olx) stack: React, Firebase Auth, Firestore, and Storage.

## Features

- **Buyers** — Browse and search cars with no login. Contact dealers via WhatsApp only.
- **Dealers** — Email or Google login, onboarding, dashboard, and car listings (add / edit / delete).

## Routes

| Path | Description |
|------|-------------|
| `/` | Car listings (public) |
| `/car/:id` | Car detail (public) |
| `/search` | Search (public) |
| `/dealer/login` | Dealer login / register |
| `/dealer/onboarding` | First-time dealer setup |
| `/dealer/dashboard` | Dealer listings |
| `/dealer/car/new` | Add listing |
| `/dealer/car/edit/:id` | Edit listing |
| `/dealer/profile` | Dealer profile |

## Setup

1. Copy `.env.example` to `.env` and add your Firebase config.
2. `npm install`
3. `npm start`
4. Deploy rules: `npm run deploy:rules`

## Firestore

- **`products`** — Car listings (`dealerId`, `title`, `price`, `imageUrls`, `isActive`, etc.)
- **`users`** — Dealer profiles (`role: "dealer"`, `dealershipName`, `whatsappNumber`, `city`)

Storage path for images: `products/{dealerId}/{filename}` (optional)

### Without Firebase Storage

Set in `.env`:

```env
REACT_APP_SKIP_STORAGE_UPLOAD=true
```

Dealers can paste **public image URLs** on the add/edit car form, or publish listings with no photos. Restart `npm start` after changing `.env`.

When Storage is ready, set `REACT_APP_SKIP_STORAGE_UPLOAD=false` and run `npm run deploy:rules`.

## Build

```bash
npm run build
```

Uses `NODE_OPTIONS=--openssl-legacy-provider` for Node 17+ with Create React App 4.

## GitHub Pages

Live site: **https://raviflobo.github.io/olx/**

### One-time setup

> **Seeing README instead of the app?** Pages is publishing the `main` branch source. Fix: open [Pages settings](https://github.com/raviflobo/olx/settings/pages) → **Build and deployment** → set **Source** to **GitHub Actions** (not “Deploy from a branch”). Then run the **Deploy to GitHub Pages** workflow under Actions, or run `npm run deploy:gh-pages` and set Source to branch **`gh-pages`** / **`/ (root)`**.

1. In the repo on GitHub: **Settings → Pages → Build and deployment → Source** → **GitHub Actions**.
2. Add repository **Secrets** (same names as `.env.example`):  
   `REACT_APP_FIREBASE_API_KEY`, `REACT_APP_FIREBASE_AUTH_DOMAIN`, `REACT_APP_FIREBASE_PROJECT_ID`, `REACT_APP_FIREBASE_STORAGE_BUCKET`, `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`, `REACT_APP_FIREBASE_APP_ID` (and optional `REACT_APP_FIREBASE_MEASUREMENT_ID`).
3. In [Firebase Console](https://console.firebase.google.com/) → Authentication → **Authorized domains**, add `raviflobo.github.io`.

### Deploy

- **Automatic:** Push to `main` runs `.github/workflows/deploy-github-pages.yml`.
- **Manual (local):** With `.env` present, run `npm run deploy:gh-pages` (publishes the `build/` folder to the `gh-pages` branch).

## Phase 9 — Polish & production readiness

- **Legacy listings** — OLX-shaped `products` docs are normalized on read (`normalizeCar.js`) so old ads show with correct titles, images, and specs.
- **Dealer dashboard** — Loads listings by `dealerId` and legacy `userId`.
- **Profile sync** — Saving dealer profile updates WhatsApp/dealership on all active listings.
- **UI** — Sticky filter chips on home, carousel dot indicators on car detail, forgot-password link on dealer login.
- **Privacy** — `/privacy` page linked from the footer.
