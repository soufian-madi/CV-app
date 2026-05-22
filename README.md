# CV App

Single-page CV / portfolio built with Vue 3, TypeScript, Vite, and Tailwind 4. Includes a WebGL fluid background, Three.js portrait shader, GSAP scroll animations, and full EN/DE localisation.

## Setup

```bash
npm install
npm run dev      # dev server at localhost:5173
npm run build    # production build
npm test         # run tests
```

## Missing files (not committed for privacy)

Copy these into place before running:

| File | Description |
|------|-------------|
| `public/portrait.jpg` | Portrait photo |
| `public/soufian-madi-cv.pdf` | CV PDF (download link in footer) |
| `public/vue-cert.pdf` | Vue.js Developer Certificate |
| `public/psm-cert.pdf` | Professional Scrum Master I Certificate |
| `public/apm-cert.pdf` | Agile Product Management Certificate |

Create a `.env` file in the project root with your contact details:

```env
VITE_EMAIL=your@email.com
VITE_PHONE=+49 123 4567890
VITE_PHONE_TEL=+491234567890
```

Without these, the app runs fine but shows placeholder values and broken asset links.
