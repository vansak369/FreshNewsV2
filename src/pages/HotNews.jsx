import React, { useEffect, useMemo, useRef, useState } from 'react';
import ArticleCard from '../components/ArticleCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import CategoryPills from '../components/CategoryPills.jsx';
import { subscribeArticles } from '../services/articlesService.js';
import { useScrollMemory } from '../hooks/useScrollMemory.js';

const BASE_CATEGORIES = ['All', 'Technology', 'World', 'Business', 'Sport', 'Culture', 'Health'];
const FILTER_KEY = 'hot-news-filters';

function readSavedFilters() {
  try {
    const raw = sessionStorage.getItem(FILTER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function HotNews() {
  const saved = readSavedFilters();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(saved?.search ?? '');
  const [category, setCategory] = useState(saved?.category ?? 'All');

  useScrollMemory('hot-news', !loading);

  useEffect(() => {
    const unsubscribe = subscribeArticles((data) => {
      setArticles(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const latest = useRef({ search, category });
  latest.current = { search, category };

  useEffect(() => {
    function saveFilters() {
      try {
        sessionStorage.setItem(FILTER_KEY, JSON.stringify(latest.current));
      } catch {
        
      }
    }
    window.addEventListener('beforeunload', saveFilters);
    return () => {
      saveFilters();
      window.removeEventListener('beforeunload', saveFilters);
    };
  }, []);

  const categories = useMemo(() => {
    const found = new Set(BASE_CATEGORIES);
    articles.forEach((a) => a.category && found.add(a.category));
    return Array.from(found);
  }, [articles]);

  const filtered = articles.filter((a) => {
    const matchesCategory = category === 'All' || a.category === category;
    const matchesSearch =
      !search ||
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main id="main">
      <section className="page-intro container">
        <span className="tag">Hot News</span>
  

        <div className="discover-controls">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryPills categories={categories} active={category} onSelect={setCategory} />
        </div>
      </section>

      <section className="block">
        <div className="container">
          <div className="section-head">
            <h3>Latest Stories</h3>
            <span className="count">{filtered.length} of {articles.length} today</span>
          </div>

          {loading && <p className="dek">Loading stories…</p>}

          {!loading && filtered.length === 0 && (
            <p className="dek">No stories yet — add your first one from the Dashboard.</p>
          )}

          <div className="grid">
            {filtered.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
