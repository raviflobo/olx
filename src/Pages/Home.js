import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import CarCard from '../Components/UI/CarCard';
import Chip from '../Components/UI/Chip';
import SkeletonCard from '../Components/UI/SkeletonCard';
import EmptyState from '../Components/UI/EmptyState';
import { fetchPublicCars } from '../utils/fetchPublicCars';
import { filterCars, uniqueValues } from '../utils/carFilters';
import './Home.css';

const FILTERS = ['All', 'Brand', 'Fuel', 'City', 'Price'];

function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [filterValue, setFilterValue] = useState({});
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchPublicCars()
      .then(setCars)
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  const brands = useMemo(() => uniqueValues(cars, 'brand'), [cars]);
  const cities = useMemo(() => uniqueValues(cars, 'city'), [cars]);
  const fuels = useMemo(() => uniqueValues(cars, 'fuelType'), [cars]);

  const filtered = useMemo(() => {
    const f = { ...filterValue };
    if (activeFilter === 'Price') {
      f.priceMin = priceMin;
      f.priceMax = priceMax;
    }
    return filterCars(cars, f);
  }, [cars, filterValue, activeFilter, priceMin, priceMax]);

  const handleChip = (name) => {
    setActiveFilter(name);
    if (name === 'All') setFilterValue({});
  };

  return (
    <Layout>
      <div className="cs-page home-page cs-page--flush-top">
        <div className="cs-container">
          <header className="home-page__hero">
            <h1 className="home-page__hero-title">Find your next car</h1>
            <p className="home-page__hero-sub">
              Browse listings from trusted dealers. Contact via WhatsApp instantly.
            </p>
            {!loading && (
              <span className="home-page__hero-count">
                {filtered.length} car{filtered.length !== 1 ? 's' : ''} available
              </span>
            )}
          </header>

          <div className="home-page__section-head">
            <h2 className="home-page__section-title">Browse listings</h2>
          </div>

          <div className="home-page__filters-sticky">
          <div className="cs-chips-row">
            {FILTERS.map((f) => (
              <Chip
                key={f}
                label={f}
                active={activeFilter === f}
                onClick={() => handleChip(f)}
              />
            ))}
          </div>

          {activeFilter === 'Brand' && (
            <div className="home-page__subchips cs-chips-row">
              {brands.map((b) => (
                <Chip
                  key={b}
                  label={b}
                  active={filterValue.brand === b}
                  onClick={() => setFilterValue({ brand: b })}
                />
              ))}
            </div>
          )}
          {activeFilter === 'Fuel' && (
            <div className="home-page__subchips cs-chips-row">
              {fuels.map((f) => (
                <Chip
                  key={f}
                  label={f}
                  active={filterValue.fuelType === f}
                  onClick={() => setFilterValue({ fuelType: f })}
                />
              ))}
            </div>
          )}
          {activeFilter === 'City' && (
            <div className="home-page__subchips cs-chips-row">
              {cities.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  active={filterValue.city === c}
                  onClick={() => setFilterValue({ city: c })}
                />
              ))}
            </div>
          )}
          {activeFilter === 'Price' && (
            <div className="home-page__price-filter">
              <input
                className="cs-input"
                type="number"
                placeholder="Min ₹"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
              />
              <input
                className="cs-input"
                type="number"
                placeholder="Max ₹"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
              />
            </div>
          )}
          </div>

          {loading && (
            <div className="cs-car-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <EmptyState
              title="No cars found"
              text="Try adjusting your filters or check back later."
              actionLabel={Object.keys(filterValue).length ? 'Clear filters' : undefined}
              onAction={
                Object.keys(filterValue).length
                  ? () => {
                      setFilterValue({});
                      setActiveFilter('All');
                      setPriceMin('');
                      setPriceMax('');
                    }
                  : undefined
              }
            />
          )}

          {!loading && filtered.length > 0 && (
            <div className="cs-car-grid">
              {filtered.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}

          <p className="home-page__dealer-link">
            <Link to="/dealer/login">Dealer Login</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
