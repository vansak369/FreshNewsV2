import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteArticle, subscribeMyArticles } from '../services/articlesService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useScrollMemory } from '../hooks/useScrollMemory.js';

export default function Dashboard() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useScrollMemory('dashboard', !loading);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsubscribe = subscribeMyArticles(user.uid, (data) => {
      setArticles(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this story?')) return;
    setDeletingId(id);
    try {
      await deleteArticle(id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main id="main">
      <section className="page-intro container">
        <span className="tag">Dashboard</span>
        <h2>Manage Stories</h2>
        <p className="lead">
          Signed in as {user?.displayName || user?.email}. Create, edit, or remove your own stories — changes
          appear on the homepage instantly.
        </p>
      </section>

      <section className="block">
        <div className="container">
          <div className="section-head">
            <h3>My Stories</h3>
            <Link to="/dashboard/new" className="btn btn-sm">+ New Story</Link>
          </div>

          {loading && <p className="dek">Loading…</p>}

          {!loading && articles.length === 0 && (
            <p className="dek">No stories yet. Create your first one.</p>
          )}

          <div className="dash-table">
            {articles.map((a) => (
              <div className="dash-row" key={a.id}>
                <div className="dash-row-main">
                  <span className="tag">{a.category}</span>
                  <h4>{a.title}</h4>
                  <p className="byline">{a.readTime} · {a.byline}</p>
                </div>
                <div className="dash-row-actions">
                  <Link to={`/dashboard/edit/${a.id}`} className="btn btn-outline btn-sm">Edit</Link>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleDelete(a.id)}
                    disabled={deletingId === a.id}
                  >
                    {deletingId === a.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
