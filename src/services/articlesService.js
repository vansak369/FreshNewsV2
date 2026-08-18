// CRUD layer for the "articles" collection in Firestore.
// Swap the collection name / fields here if you'd rather manage a different
// entity (e.g. "products", "services") — every page consumes this file only.
import { latestStories } from '../data/articles.js';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase.js';

const articlesRef = collection(db, 'articles');

// CREATE
export async function createArticle(data, authorId) {
  const docRef = await addDoc(articlesRef, {
    title: data.title,
    excerpt: data.excerpt,
    category: data.category,
    readTime: data.readTime,
    imageUrl: data.imageUrl || '',
    byline: data.byline || '',
    authorId: authorId || null,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// READ (one-time list, ordered newest first)
export async function getArticles() {
  const q = query(articlesRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// READ (realtime subscription — preferred for the home feed)
// normalize sample data (headline/tag/image) to match the Firestore schema (title/category/imageUrl)
const sampleArticles = latestStories.map((story) => ({
  id: story.id,
  title: story.headline,
  excerpt: story.excerpt,
  category: story.tag,
  readTime: story.byline, // adjust if you have a separate readTime field on real docs
  imageUrl: story.image,
  byline: story.byline,
  isSample: true, // lets you tell sample vs real apart later if needed
}));

// READ (realtime subscription — preferred for the home feed)
export function subscribeArticles(callback) {
  const q = query(articlesRef, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const realArticles = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    // real articles first (newest), sample articles fill the rest — nothing is ever deleted from either set
    callback([...realArticles, ...sampleArticles]);
  });
}
// READ (realtime subscription — Dashboard / "My Stories")
// Scoped to the signed-in user's own articles only: no other account's
// articles, and no sample/demo content (samples aren't owned by anyone, so
// they don't belong in a personal dashboard). Sorting is done client-side so
// this doesn't require a composite Firestore index.
export function subscribeMyArticles(userId, callback) {
  const q = query(articlesRef, where('authorId', '==', userId));
  return onSnapshot(q, (snap) => {
    const articles = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    articles.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    callback(articles);
  });
}

// READ (single article)
export async function getArticle(id) {
  const snap = await getDoc(doc(db, 'articles', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// READ (single article, for the public detail page)
// Sample/demo articles don't have a real Firestore document behind them, so
// we check the in-memory sample list first (no network call, can't fail) and
// only hit Firestore for ids that aren't a known sample id.
export async function getArticleForDetail(id) {
  const sample = sampleArticles.find((a) => a.id === id);
  if (sample) return sample;
  return getArticle(id);
}

// UPDATE
export function updateArticle(id, data) {
  return updateDoc(doc(db, 'articles', id), data);
}

// DELETE
export function deleteArticle(id) {
  return deleteDoc(doc(db, 'articles', id));
}
