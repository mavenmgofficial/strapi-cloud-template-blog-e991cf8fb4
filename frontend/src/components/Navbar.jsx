import { Link, NavLink } from 'react-router-dom';
import { useGetCategoriesQuery } from '../services/strapiApi';
import './Navbar.css';

export default function Navbar() {
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo-text">MML</span>
          <span className="navbar__tagline">My Military Lifestyle</span>
        </Link>

        <div className="navbar__links">
          <NavLink to="/" className="navbar__link" end>
            Home
          </NavLink>
          {categories.map((cat) => (
            <NavLink
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="navbar__link"
            >
              {cat.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
