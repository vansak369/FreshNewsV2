import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getArticleForDetail } from '../services/articlesService.js';

function formatDate(value) {
  if (!value) return null;
  
  const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    setArticle(null);

    getArticleForDetail(id)
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setError(true);
        } else {
          setArticle(data);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  function handleBack() {
  
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }

  if (loading) {
    return (
      <main id="main">
        <section className="page-intro container"><p className="dek">Loading story…</p></section>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main id="main">
        <section className="page-intro container article-not-found">
          <span className="tag">Not Found</span>
          <h2>We couldn't find that story</h2>
          <p className="lead">It may have been removed, or the link might be broken.</p>
          <button type="button" className="back-link" onClick={handleBack} style={{ marginTop: 8 }}>
            ← Back
          </button>
        </section>
      </main>
    );
  }

  const publishedOn = formatDate(article.createdAt);

  return (
    <main id="main">
      <section className="page-intro container">
        <button type="button" className="back-link" onClick={handleBack}>
          ← Back
        </button>
        <span className="tag">{article.category}</span>
        <h2>{article.title}</h2>
        {article.excerpt && <p className="lead">{article.excerpt}</p>}

        <div className="article-meta-row">
          {article.byline && <span>{article.byline}</span>}
          {publishedOn && <span>· {publishedOn}</span>}
          {article.readTime && <span>· {article.readTime}</span>}
        </div>
      </section>

      <section className="block">
        <div className="container">
          {article.imageUrl && (
            <div className="article-page-media">
              <img src={article.imageUrl} alt={article.title} />
            </div>
          )}

          <div className="article-body">
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <p>{article.excerpt}</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
