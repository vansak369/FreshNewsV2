import React from 'react';
import { Link } from 'react-router-dom';

export default function ArticleCard({ article }) {
  return (
    <Link to={`/article/${article.id}`} className="card card-link">
      <div className="card-thumb-wrap">
        {article.imageUrl ? (
          <img className="card-thumb" src={article.imageUrl} alt={article.title} />
        ) : (
          <div className="card-thumb card-thumb-placeholder" />
        )}
        <span className="badge-category">{article.category}</span>
        {article.readTime && <span className="badge-time">⏱ {article.readTime}</span>}
      </div>
      <span className="tag">{article.category}</span>
      <h4>{article.title}</h4>
      <p>{article.excerpt}</p>
      {article.byline && <p className="byline">{article.byline}</p>}
    </Link>
  );
}
