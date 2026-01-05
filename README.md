
# Copilot Demo Store (React, HTML, JS)

A minimal e‑commerce demo built with React (via CDN), plain HTML, and JavaScript. No build tools required. Just open `index.html`.

## Features
- Product grid, search, and tags
- Add to cart, update quantities, remove items
- Persistent cart via `localStorage`
- Fake checkout with generated order id
- Responsive layout

## Structure
```
.
├── index.html
├── assets/
│   ├── styles.css
│   ├── headphones.jpg (SVG placeholder)
│   ├── smartwatch.jpg (SVG placeholder)
│   └── speaker.jpg (SVG placeholder)
├── data/
│   └── products.json
└── js/
    └── app.jsx
```

## Running locally
- Double‑click `index.html` or serve the folder with any static server. No npm needed.

## Deploying to GitHub Pages
1. Create a new repository named `ecommerce-demo-react`.
2. Commit and push these files.
3. In **Settings → Pages**, set source to the `main` branch, root (`/`).
4. Once published, your site will be available at `https://<your-user>.github.io/ecommerce-demo-react/`.

## Notes
- React and Babel are loaded from public CDNs in `index.html`. For an enterprise deployment, replace CDNs with locally hosted copies.
- Images are simple SVG placeholders saved with `.jpg` filenames for convenience.
- This is for demonstration purposes only; there is no backend and no payment processing.
