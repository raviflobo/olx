/**
 * Map legacy OLX product docs to CARONSELL car shape for display.
 */
function normalizeFuelType(value) {
  if (!value) return '';
  const v = String(value);
  if (v.includes('Electric')) return 'Electric';
  if (v.includes('CNG') || v.includes('Hybrid') || v.includes('LPG')) return 'Hybrid';
  if (v.toLowerCase().includes('diesel')) return 'Diesel';
  if (v.toLowerCase().includes('petrol')) return 'Petrol';
  return v;
}

function resolveIsActive(raw) {
  if (typeof raw.isActive === 'boolean') return raw.isActive;
  if (raw.status === 'inactive' || raw.status === 'sold' || raw.status === 'draft') {
    return false;
  }
  if (raw.status === 'active') return true;
  return raw.moderationStatus !== 'rejected';
}

export function normalizeCar(raw, id) {
  if (!raw) return null;
  const extra = raw.extra && typeof raw.extra === 'object' ? raw.extra : {};

  const imageUrls = Array.isArray(raw.imageUrls) && raw.imageUrls.length
    ? raw.imageUrls
    : Array.isArray(raw.images)
      ? raw.images
      : raw.url
        ? [raw.url]
        : [];

  return {
    id: id || raw.id,
    dealerId: raw.dealerId || raw.userId || '',
    dealerName: raw.dealerName || raw.sellerName || '',
    dealershipName: raw.dealershipName || raw.businessInfo?.name || '',
    dealerWhatsapp: raw.dealerWhatsapp || raw.sellerPhone || raw.contactPhone || '',
    title: (raw.title || raw.name || '').trim(),
    brand: (raw.brand || extra.brand || '').trim(),
    model: (raw.model || extra.model || '').trim(),
    year: Number(raw.year || extra.year) || null,
    price: Number(raw.price) || 0,
    mileage: Number(raw.mileage ?? extra.kmDriven ?? extra.mileage) || null,
    fuelType: normalizeFuelType(raw.fuelType || extra.fuelType),
    transmission: raw.transmission || extra.transmission || '',
    condition: raw.condition || extra.condition || '',
    color: raw.color || extra.color || '',
    description: raw.description || '',
    imageUrls,
    city: (raw.city || raw.location?.city || '').trim(),
    isActive: resolveIsActive(raw),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export function normalizeCarList(docs) {
  return docs
    .map((d) => {
      const data = typeof d.data === 'function' ? d.data() : d;
      const id = d.id || data.id;
      return normalizeCar(data, id);
    })
    .filter(Boolean);
}

export function isPublicCar(car) {
  return car && car.isActive !== false && car.title;
}
