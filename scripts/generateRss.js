// Generates public/rss.xml from the live "articles" collection in Firestore.
//
// This app is a static React/Vite site (deployed as plain files, e.g. to
// GitHub Pages) — there's no server process available to answer a request
// like GET /rss.xml on demand. So instead of a live endpoint, this script
// reads the current articles straight from Firestore and writes a valid
// RSS 2.0 file to public/rss.xml, which Vite then ships as a normal static
// file at /rss.xml on every build/deploy. Run it whenever you publish new
// articles and want the feed to reflect them:
//
//   node scripts/generateRss.js
//
// Optional env vars:
//   SITE_URL   Base URL used to build article links in the feed
//              (defaults to https://today.news — replace with your real
//              deployed URL, e.g. https://<user>.github.io/<repo>)
//   RSS_LIMIT  Max number of articles to include (defaults to 20)
//
// Uses the same public Firebase web config as the app itself (src/firebase.js),
// read from .env.local via the VITE_FIREBASE_* variables — no service
// account or admin credentials required, since the "articles" collection is
// already readable by anyone (the Home page reads it while signed out).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, orderBy, query, limit } from 'firebase/firestore';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// ---- Load VITE_FIREBASE_* values from .env.local (Vite doesn't expose
// these to plain Node scripts, so we parse the file ourselves). ----
function loadEnvLocal() {
  const envPath = path.join(projectRoot, '.env.local');
  if (!existsSync(envPath)) return;
  const contents = readFileSync(envPath, 'utf8');
  for (const line of contents.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadEnvLocal();

const SITE_URL = (process.env.SITE_URL || 'https://today.news').replace(/\/+$/, '');
const RSS_LIMIT = Number(process.env.RSS_LIMIT) || 20;

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId) {
  console.error(
    'Missing Firebase config. Make sure .env.local has the VITE_FIREBASE_* values ' +
      '(same file the app itself uses), or set them as environment variables.'
  );
  process.exit(1);
}

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(timestamp) {
  const date = timestamp?.toDate ? timestamp.toDate() : new Date();
  return date.toUTCString();
}

async function main() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const articlesRef = collection(db, 'articles');
  const q = query(articlesRef, orderBy('createdAt', 'desc'), limit(RSS_LIMIT));
  const snap = await getDocs(q);
  const articles = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const items = articles
    .map((article) => {
      const link = `${SITE_URL}/article/${article.id}`;
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <category>${escapeXml(article.category)}</category>
      <pubDate>${toRfc822(article.createdAt)}</pubDate>
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Today.news</title>
    <link>${SITE_URL}</link>
    <description>The latest stories from Today.news</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  const outPath = path.join(projectRoot, 'public', 'rss.xml');
  writeFileSync(outPath, rss, 'utf8');
  console.log(`Wrote ${articles.length} articles to ${path.relative(projectRoot, outPath)}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Failed to generate RSS feed:', err);
  process.exit(1);
});
