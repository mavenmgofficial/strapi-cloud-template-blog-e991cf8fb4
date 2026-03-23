import { useParams, Link } from 'react-router-dom';
import { useGetArticleBySlugQuery, getStrapiMedia } from '../services/strapiApi';
import './Article.css';

function BlockRenderer({ block }) {
  switch (block.__component) {
    case 'shared.rich-text':
      return (
        <div
          className="article__rich-text"
          dangerouslySetInnerHTML={{ __html: block.body }}
        />
      );

    case 'shared.quote':
      return (
        <blockquote className="article__quote">
          {block.title && <h4 className="article__quote-title">{block.title}</h4>}
          <p>{block.body}</p>
        </blockquote>
      );

    case 'shared.media': {
      const mediaUrl = getStrapiMedia(block.file?.url);
      if (!mediaUrl) return null;
      return (
        <figure className="article__media">
          <img src={mediaUrl} alt={block.file?.alternativeText || ''} />
        </figure>
      );
    }

    case 'shared.slider': {
      const files = block.files || [];
      if (files.length === 0) return null;
      return (
        <div className="article__slider">
          {files.map((file, i) => {
            const url = getStrapiMedia(file.url);
            return url ? (
              <img key={i} src={url} alt={file.alternativeText || ''} />
            ) : null;
          })}
        </div>
      );
    }

    default:
      return null;
  }
}

export default function Article() {
  const { slug } = useParams();
  const { data: article, isLoading, error } = useGetArticleBySlugQuery(slug);

  if (isLoading) {
    return (
      <div className="article-page">
        <div className="article-page__container">
          <div className="article__skeleton">
            <div className="skeleton-block skeleton-block--title" />
            <div className="skeleton-block skeleton-block--meta" />
            <div className="skeleton-block skeleton-block--image" />
            <div className="skeleton-block" />
            <div className="skeleton-block" />
            <div className="skeleton-block skeleton-block--short" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-page">
        <div className="article-page__container">
          <div className="article__not-found">
            <h2>Article not found</h2>
            <p>The article you're looking for doesn't exist or has been removed.</p>
            <Link to="/" className="article__back-link">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const coverUrl = getStrapiMedia(article.cover?.url);
  const authorName = article.author?.name;
  const authorAvatar = getStrapiMedia(article.author?.avatar?.url);
  const categoryName = article.category?.name;
  const categorySlug = article.category?.slug;
  const date = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const blocks = article.blocks || [];

  return (
    <div className="article-page">
      <div className="article-page__container">
        <Link to="/" className="article__breadcrumb">Home</Link>
        {categoryName && (
          <>
            <span className="article__breadcrumb-sep">/</span>
            <Link to={`/category/${categorySlug}`} className="article__breadcrumb">
              {categoryName}
            </Link>
          </>
        )}

        <article className="article">
          <header className="article__header">
            {categoryName && (
              <span className="article__category-badge">{categoryName}</span>
            )}
            <h1 className="article__title">{article.title}</h1>
            {article.description && (
              <p className="article__description">{article.description}</p>
            )}

            <div className="article__meta">
              {authorAvatar && (
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="article__author-avatar"
                />
              )}
              <div>
                {authorName && (
                  <span className="article__author-name">{authorName}</span>
                )}
                <span className="article__date">{date}</span>
              </div>
            </div>
          </header>

          {coverUrl && (
            <div className="article__cover">
              <img src={coverUrl} alt={article.title} />
            </div>
          )}

          <div className="article__body">
            {blocks.map((block, index) => (
              <BlockRenderer key={index} block={block} />
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
