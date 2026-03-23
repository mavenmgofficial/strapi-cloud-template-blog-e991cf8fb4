import { Link } from 'react-router-dom';
import { getStrapiMedia } from '../services/strapiApi';
import './ArticleCard.css';

export default function ArticleCard({ article }) {
  const { title, description, slug, cover, category, author, createdAt } = article;

  const coverUrl = getStrapiMedia(cover?.url);
  const authorName = author?.name;
  const authorAvatar = getStrapiMedia(author?.avatar?.url);
  const categoryName = category?.name;
  const date = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link to={`/article/${slug}`} className="article-card">
      <div className="article-card__image-wrapper">
        {coverUrl ? (
          <img src={coverUrl} alt={title} className="article-card__image" />
        ) : (
          <div className="article-card__image-placeholder">
            <span>MML</span>
          </div>
        )}
        {categoryName && (
          <span className="article-card__category">{categoryName}</span>
        )}
      </div>

      <div className="article-card__content">
        <h3 className="article-card__title">{title}</h3>
        {description && (
          <p className="article-card__description">{description}</p>
        )}

        <div className="article-card__meta">
          {authorAvatar && (
            <img
              src={authorAvatar}
              alt={authorName}
              className="article-card__avatar"
            />
          )}
          <div className="article-card__meta-text">
            {authorName && (
              <span className="article-card__author">{authorName}</span>
            )}
            <span className="article-card__date">{date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
