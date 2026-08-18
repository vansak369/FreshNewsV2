# Lab 11 - ReactJS Part 2: Login & Register with Firebase (React + Vite)

A React + Vite app with Firebase Email/Password authentication, a
protected dashboard, login/register pages, and a responsive
navbar/sidebar/footer layout - matching the lab spec exactly.

---

## 1. What you need to install first

1. **Node.js 18+** (includes npm) - https://nodejs.org/
   Check with: `node -v` and `npm -v`
2. A free **Google/Gmail account** to create a Firebase project

Everything else (React, Vite, Tailwind CSS v4, react-router-dom, the
`firebase` SDK) is already declared in `package.json` and installs
automatically with `npm install` - no manual downloads needed.

---

## 2. Create your own Firebase project

You must create your **own** Firebase project - this repo does not
ship with real credentials.

1. Go to https://console.firebase.google.com and sign in.
2. **Create a new project** (e.g. `my-react-app`). Gemini/Analytics can
   both be left off for this lab.
3. In the left sidebar go to **Build > Authentication** (or
   **Security > Authentication** depending on the console layout) →
   **Get started**.
4. Under **Sign-in method**, click **Email/Password**, toggle it
   **Enabled**, and **Save**. (Leave "Email link" disabled.)
5. Go back to **Project Overview** → click the **`</>`** (Web) icon to
   register a new web app → give it a nickname → **Register app**.
6. Firebase will show you a `firebaseConfig` object with your keys.
   Keep that tab open (or copy the values) - you'll need them next.

---

## 3. Configure your local environment variables

1. Copy `.env.local.example` to a new file named **`.env.local`**
   (same folder, project root).
2. Paste in the values from your `firebaseConfig` object:

```env
VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_AUTH_DOMAIN="..."
VITE_FIREBASE_PROJECT_ID="..."
VITE_FIREBASE_STORAGE_BUCKET="..."
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."
```

`.env.local` is already excluded from git via `.gitignore` (`*.local`),
so your keys won't accidentally get committed.

---

## 4. Install and run

```bash
npm install
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`) - open
it in your browser.

- Click **Register** to create an account (min. 6 character password).
- You'll be logged in immediately and redirected to the **Dashboard**.
- Click **Logout** to sign out, then **Login** to sign back in.
- Try the **hamburger icon** next to the logo to toggle the sidebar.

### Build for production
```bash
npm run build   # outputs to dist/
npm run preview # preview the production build locally
```

---

## Project structure

```
reactjs-lab11/
├── index.html
├── vite.config.js          (Tailwind CSS v4 Vite plugin registered here)
├── .env.local.example      (copy to .env.local and fill in your keys)
└── src/
    ├── main.jsx
    ├── App.jsx              (routing + Firebase auth session listener)
    ├── index.css             (@import "tailwindcss";)
    ├── lib/
    │   └── firebaseClient.js
    ├── pages/
    │   ├── HomePage.jsx      (public landing page / dashboard when logged in)
    │   ├── LoginPage.jsx
    │   └── RegisterPage.jsx
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Sidebar.jsx
    │   ├── Footer.jsx
    │   └── Dashboard.jsx     (StatCard, TableRow)
    └── assets/
        ├── profile.jpg       (placeholder - swap for your own photo)
        └── stem.jpeg         (placeholder - swap for your own image)
```

**Note on images:** `src/assets/profile.jpg` and `src/assets/stem.jpeg`
are simple generated placeholders so the project builds out of the
box. Replace them with your own images (keep the same filenames, or
update the `import` paths in `src/pages/HomePage.jsx`).

---

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Blank page, console error about `firebaseConfig`/`auth/invalid-api-key` | `.env.local` is missing or has the wrong values. Double check you copied every field from your Firebase project's web app config, and that the file is named exactly `.env.local` (not `.env.local.txt`). |
| Changes to `.env.local` don't seem to apply | Restart `npm run dev` - Vite only reads env files at startup. |
| `auth/email-already-in-use` when registering | That email is already registered in your Firebase project - just log in instead, or use a different email. |
| Sidebar/navbar look unstyled | Make sure `npm install` finished without errors (Tailwind CSS v4 + `@tailwindcss/vite` need to be present) and that you're importing `./index.css` in `main.jsx` (it already is, by default). |
