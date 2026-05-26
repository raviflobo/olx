import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import CarCard from '../Components/UI/CarCard';
import SkeletonCard from '../Components/UI/SkeletonCard';
import EmptyState from '../Components/UI/EmptyState';
import { fetchPublicCars } from '../utils/fetchPublicCars';
import { filterCars } from '../utils/carFilters';
import './SearchResults.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery();
  const history = useHistory();
  const q = query.get('q') || '';
  const [searchInput, setSearchInput] = useState(q);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  useEffect(() => {
    setLoading(true);
    fetchPublicCars()
      .then(setCars)
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => filterCars(cars, { search: q }),
    [cars, q]
  );

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchInput.trim();
    history.push(term ? `/search?q=${encodeURIComponent(term)}` : '/search');
  };

  return (
    <Layout>
      <div className="cs-page search-page cs-page--flush-top">
        <div className="cs-container">
          <div className="search-page__head">
            <h1 className="search-page__title">Search</h1>
            {q && <p className="search-page__query">&ldquo;{q}&rdquo;</p>}
          </div>

          <form className="search-page__form" onSubmit={handleSearch}>
            <input
              className="cs-input search-page__input"
              type="search"
              placeholder="Search cars…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="cs-btn cs-btn--primary">
              Search
            </button>
          </form>

          <p className="search-page__count">
            {!loading && `${filtered.length} car${filtered.length !== 1 ? 's' : ''} found`}
          </p>

          {loading && (
            <div className="cs-car-grid">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <EmptyState title="No results" text="Try a different search term." />
          )}

          {!loading && filtered.length > 0 && (
            <div className="cs-car-grid">
              {filtered.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default SearchResults;
