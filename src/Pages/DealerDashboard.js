import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../contextStore/AuthContext';
import { ToastContext } from '../contextStore/ToastContext';
import { fetchDealerListings, deleteCarDoc } from '../firebase/collections';
import { normalizeCar } from '../utils/normalizeCar';
import Layout from '../Components/Layout/Layout';
import PageHeader from '../Components/UI/PageHeader';
import EmptyState from '../Components/UI/EmptyState';
import Badge from '../Components/UI/Badge';
import Button from '../Components/UI/Button';
import { formatPriceIN } from '../utils/whatsapp';
import BarLoading from '../Components/Loading/BarLoading';
import { signOut } from '../firebase/auth';
import './DealerDashboard.css';

function DealerDashboard() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const history = useHistory();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!user) return;
    setLoading(true);
    fetchDealerListings(user.uid)
      .then((list) => setCars(list.map((item) => normalizeCar(item, item.id))))
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, [user]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await deleteCarDoc(id);
      addToast('Listing deleted.', 'success');
      load();
    } catch {
      addToast('Could not delete listing.', 'error');
    }
  };

  return (
    <Layout>
      <div className="cs-page dealer-dashboard cs-page--flush-top">
        <div className="cs-container">
        <div className="dealer-dashboard__head">
          <PageHeader
            title="My listings"
            actionLabel="+ Add car"
            onAction={() => history.push('/dealer/car/new')}
          />
        </div>
        <div className="dealer-dashboard__links">
          <button type="button" className="cs-btn cs-btn--ghost cs-btn--sm" onClick={() => history.push('/dealer/profile')}>
            Profile settings
          </button>
          <button
            type="button"
            className="cs-btn cs-btn--outline cs-btn--sm"
            onClick={() => signOut().then(() => history.push('/'))}
          >
            Log out
          </button>
        </div>

        {loading && <BarLoading inline />}
        {!loading && cars.length === 0 && (
          <EmptyState
            title="No listings yet"
            text="Post your first car to appear on CARONSELL."
            actionLabel="Post new listing"
            onAction={() => history.push('/dealer/car/new')}
          />
        )}
        {!loading &&
          cars.map((car) => (
            <div key={car.id} className="cs-list-row">
              <img
                className="cs-list-row__thumb"
                src={car.imageUrls?.[0] || ''}
                alt=""
              />
              <div className="cs-list-row__body">
                <p className="cs-list-row__title">{car.title}</p>
                <p className="cs-list-row__price">{formatPriceIN(car.price)}</p>
                <Badge variant={car.isActive ? 'success' : 'muted'}>
                  {car.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="cs-list-row__actions">
                <Button
                  variant="outline"
                  small
                  onClick={() => history.push(`/dealer/car/edit/${car.id}`)}
                >
                  Edit
                </Button>
                <Button variant="danger" small onClick={() => handleDelete(car.id, car.title)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default DealerDashboard;
