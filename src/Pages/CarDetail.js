import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { AuthContext } from '../contextStore/AuthContext';
import { getCarById } from '../firebase/collections';
import { normalizeCar } from '../utils/normalizeCar';
import Layout from '../Components/Layout/Layout';
import Button from '../Components/UI/Button';
import Badge from '../Components/UI/Badge';
import BarLoading from '../Components/Loading/BarLoading';
import { formatPriceIN, openWhatsApp, carInterestMessage } from '../utils/whatsapp';
import './CarDetail.css';

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function CarDetail() {
  const { id } = useParams();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    setImgIndex(0);
    getCarById(id)
      .then((raw) => setCar(normalizeCar(raw, id)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="cs-page"><BarLoading /></div>
      </Layout>
    );
  }

  if (!car) {
    return (
      <Layout>
        <div className="cs-page cs-container">
          <p>Listing not found.</p>
          <Button variant="outline" onClick={() => history.push('/')}>
            Back to listings
          </Button>
        </div>
      </Layout>
    );
  }

  const images = car.imageUrls?.length ? car.imageUrls : car.images || [];
  const isOwner = user && car.dealerId === user.uid;
  const goPrev = () =>
    setImgIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  const goNext = () =>
    setImgIndex((i) => (i >= images.length - 1 ? 0 : i + 1));

  const specs = [
    ['Year', car.year],
    ['Mileage', car.mileage != null ? `${car.mileage} km` : null],
    ['Fuel', car.fuelType],
    ['Transmission', car.transmission],
    ['Condition', car.condition],
    ['Color', car.color],
    ['City', car.city],
  ].filter(([, v]) => v != null && v !== '');

  return (
    <Layout hideMobileNav>
      <div className="cs-page car-detail">
        <div className="cs-container car-detail__inner">
          {images.length > 0 ? (
            <div className="car-detail__gallery">
              {images.length > 1 && (
                <span className="car-detail__counter">
                  {imgIndex + 1} / {images.length}
                </span>
              )}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="car-detail__nav car-detail__nav--prev"
                    onClick={goPrev}
                    aria-label="Previous photo"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="car-detail__nav car-detail__nav--next"
                    onClick={goNext}
                    aria-label="Next photo"
                  >
                    ›
                  </button>
                </>
              )}
              <img src={images[imgIndex]} alt="" className="car-detail__main-img" />
              {images.length > 1 && (
                <div className="car-detail__dots" role="tablist" aria-label="Image gallery">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={i === imgIndex}
                      className={`car-detail__dot ${i === imgIndex ? 'car-detail__dot--active' : ''}`}
                      onClick={() => setImgIndex(i)}
                      aria-label={`Image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
              {images.length > 1 && (
                <div className="car-detail__thumbs">
                  {images.map((url, i) => (
                    <button
                      key={url}
                      type="button"
                      className={`car-detail__thumb ${i === imgIndex ? 'car-detail__thumb--active' : ''}`}
                      onClick={() => setImgIndex(i)}
                    >
                      <img src={url} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="car-detail__no-img">No photos</div>
          )}

          <div className="car-detail__content">
            <p className="car-detail__price">{formatPriceIN(car.price)}</p>
            <h1 className="car-detail__title">{car.title || car.name}</h1>
            {car.fuelType && <Badge variant="fuel">{car.fuelType}</Badge>}

            {isOwner && (
              <Link to={`/dealer/car/edit/${car.id}`} className="car-detail__edit">
                Edit listing
              </Link>
            )}

            <div className="car-detail__specs">
              {specs.map(([label, value]) => (
                <div key={label} className="car-detail__spec">
                  <span className="car-detail__spec-label">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>

            {car.description && (
              <>
                <h2 className="cs-section-title">Description</h2>
                <p className="car-detail__desc">{car.description}</p>
              </>
            )}

            <div className="car-detail__dealer">
              <h2 className="cs-section-title">Dealer</h2>
              <p className="car-detail__dealer-name">{car.dealerName || 'Dealer'}</p>
              {car.dealershipName && <p className="car-detail__dealer-meta">{car.dealershipName}</p>}
              {car.city && <p className="car-detail__dealer-city">{car.city}</p>}
              <div className="car-detail__wa-wrap">
                <Button
                  variant="whatsapp"
                  block
                  className="car-detail__wa-btn"
                  onClick={() =>
                    openWhatsApp(
                      car.dealerWhatsapp,
                      carInterestMessage(car.title || car.name)
                    )
                  }
                >
                  <WhatsAppIcon />
                  Contact on WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CarDetail;
