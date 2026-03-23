import { useGetArticlesQuery } from '../services/strapiApi';
import ArticleCard from '../components/ArticleCard';
import './Home.css';

export default function Home() {
  const { data, isLoading, error } = useGetArticlesQuery();
  const articles = data?.data || [];

  if (isLoading) {
    return (
      <div className="home">
        <div className="home__container">
          <div className="home__hero">
            <h1 className="home__title">My Military Lifestyle</h1>
            <p className="home__subtitle">Loading articles...</p>
          </div>
          <div className="home__grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-card__image" />
                <div className="skeleton-card__content">
                  <div className="skeleton-card__line skeleton-card__line--title" />
                  <div className="skeleton-card__line" />
                  <div className="skeleton-card__line skeleton-card__line--short" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <div className="home__container">
          <div className="home__error">
            <h2>Unable to load articles</h2>
            <p>
              Make sure your Strapi server is running at{' '}
              <code>{import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'}</code>
            </p>
            <p className="home__error-detail">
              {error.status && `Status: ${error.status}`}
              {error.error && ` — ${error.error}`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="home__container">
        <div className="home__hero">
          <h1 className="home__title">My Military Lifestyle</h1>
          <p className="home__subtitle">
            Your trusted source for military lifestyle, family tips, and community resources.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="home__empty">
            <p>No articles found. Add some content in the Strapi admin panel.</p>
          </div>
        ) : (
          <div className="home__grid">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
