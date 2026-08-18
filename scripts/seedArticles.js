// One-time helper: seeds 6 real articles (one per category) into your
// Firestore "articles" collection, so the homepage has real Firestore-backed
// content instead of only the hardcoded fallback stories.
//
// It signs in as an EXISTING Fresh News account first, so the seeded
// articles get a real authorId/authorName — exactly like anything created
// from the Dashboard — and you'll be able to edit/delete them from there.
//
// HOW TO RUN (from the project root, e.g. Fresh.news/):
//
//   macOS/Linux:
//     SEED_EMAIL="you@example.com" SEED_PASSWORD="yourpassword" node scripts/seedArticles.js
//
//   Windows (PowerShell):
//     $env:SEED_EMAIL="you@example.com"; $env:SEED_PASSWORD="yourpassword"; node scripts/seedArticles.js
//
// If you don't have an account yet, register one on the site first
// (/register), then use those credentials here.

import { readFileSync } from 'node:fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';

const EMAIL = process.env.SEED_EMAIL;
const PASSWORD = process.env.SEED_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error('Missing SEED_EMAIL / SEED_PASSWORD environment variables. See the comment at the top of this file for how to run it.');
  process.exit(1);
}

function loadEnvLocal() {
  const raw = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
  const env = {};
  for (const line of raw.split('\n')) {
    const match = line.match(/^([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (match) env[match[1]] = match[2];
  }
  return env;
}

const env = loadEnvLocal();

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
});

const auth = getAuth(app);
const db = getFirestore(app);

const articles = [
  {
    title: "Local startups race to build the region's first AI-powered crop forecasting tool",
    excerpt: 'A small team in Phnom Penh is combining satellite imagery and farmer-reported data to predict yields weeks ahead of harvest.',
    content:
      '<p>A small team in Phnom Penh is combining satellite imagery and farmer-reported data to predict crop yields weeks ahead of harvest — and investors have noticed.</p><p>The tool merges weather patterns with on-the-ground reports from partner cooperatives, aiming to give smallholder farmers an earlier warning of poor yields.</p>',
    category: 'Technology',
    readTime: '6 min read',
    imageUrl: '/images/tech.jpg',
    byline: 'By Sothea Ly',
  },
  {
    title: 'Coastal cities pilot floating barriers ahead of monsoon season',
    excerpt: 'Engineers say the modular design can be deployed in under 48 hours and scaled to fit smaller river deltas.',
    content:
      '<p>Engineers say the modular design can be deployed in under 48 hours and scaled to fit smaller river deltas.</p><p>The pilot program, now running in three coastal districts, is being watched closely by neighboring cities weighing similar investments.</p>',
    category: 'World',
    readTime: '4 min read',
    imageUrl: '/images/world.jpg',
    byline: 'By Vong Vansak',
  },
  {
    title: 'Garment exporters pivot to recycled fibers as buyers demand greener supply chains',
    excerpt: 'Three major manufacturers confirm new contracts tied directly to sustainability benchmarks.',
    content:
      '<p>Three major manufacturers confirm new contracts tied directly to sustainability benchmarks.</p><p>Industry groups say the shift reflects pressure from international buyers rather than local regulation.</p>',
    category: 'Business',
    readTime: '5 min read',
    imageUrl: '/images/business.jpg',
    byline: 'By Vannak Thanuk',
  },
  {
    title: 'Underdog squad books semifinal spot with stoppage-time winner',
    excerpt: 'A packed stadium erupted as the home side completed a comeback few saw coming.',
    content:
      '<p>A packed stadium erupted as the home side completed a comeback few saw coming.</p><p>The winning goal came in the fourth minute of stoppage time, capping a second-half rally from two goals down.</p>',
    category: 'Sport',
    readTime: '3 min read',
    imageUrl: '/images/sport.jpg',
    byline: 'By Vibol Sok',
  },
  {
    title: 'Independent film festival doubles entries, adds a youth filmmaker category',
    excerpt: 'Organizers say submissions from first-time directors under 25 rose sharply this year.',
    content:
      "<p>Organizers say submissions from first-time directors under 25 rose sharply this year.</p><p>The festival's new youth category will award a production grant alongside the usual jury prizes.</p>",
    category: 'Culture',
    readTime: '4 min read',
    imageUrl: '/images/Culture.jpg',
    byline: 'By Vong Vansak',
  },
  {
    title: 'New community clinics cut average wait times by half in pilot districts',
    excerpt: 'A streamlined referral system is being credited for faster diagnoses in early trials.',
    content:
      '<p>A streamlined referral system is being credited for faster diagnoses in early trials.</p><p>Health officials plan to expand the program to five additional districts by year end.</p>',
    category: 'Health',
    readTime: '5 min read',
    imageUrl: '/images/health.jpg',
    byline: 'By Kimheng Lim',
  },
];

async function run() {
  console.log('Signing in as', EMAIL, '...');
  const cred = await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);
  const user = cred.user;
  console.log('Signed in as uid', user.uid);

  const articlesRef = collection(db, 'articles');

  for (const article of articles) {
    const docRef = await addDoc(articlesRef, {
      ...article,
      authorId: user.uid,
      authorName: user.displayName || user.email,
      published: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('Created:', article.title, '->', docRef.id);
  }

  console.log(`Done. Seeded ${articles.length} articles.`);
  process.exit(0);
}

run().catch((err) => {
  console.error('Seeding failed:', err.code || err.message || err);
  process.exit(1);
});
