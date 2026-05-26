/**
 * CARONSELL product (car listing) helpers.
 */
import { db, productsRef, getProductRef } from './refs';
import { serverTimestamp } from './fieldValues';

export { getProductRef };

export const getActiveCarsQuery = () =>
  productsRef()
    .where('isActive', '==', true)
    .orderBy('createdAt', 'desc');

export const getDealerCarsQuery = (dealerId) =>
  productsRef()
    .where('dealerId', '==', dealerId)
    .orderBy('createdAt', 'desc');

export function buildCarDoc(data, dealer = {}) {
  const now = serverTimestamp();
  return {
    dealerId: data.dealerId,
    dealerName: data.dealerName || dealer.name || '',
    dealershipName: data.dealershipName || dealer.dealershipName || '',
    dealerWhatsapp: data.dealerWhatsapp || dealer.whatsappNumber || '',
    title: (data.title || '').trim(),
    brand: (data.brand || '').trim(),
    model: (data.model || '').trim(),
    year: Number(data.year) || 0,
    price: Number(data.price) || 0,
    mileage: Number(data.mileage) || 0,
    fuelType: data.fuelType || '',
    transmission: data.transmission || '',
    condition: data.condition || '',
    color: (data.color || '').trim(),
    description: (data.description || '').trim(),
    imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : [],
    city: (data.city || '').trim(),
    isActive: data.isActive !== false,
    createdAt: data.createdAt || now,
    updatedAt: now,
  };
}

export async function createCarDoc(data, dealer = {}) {
  const payload = buildCarDoc(data, dealer);
  const ref = await productsRef().add(payload);
  return ref.id;
}

export async function updateCarDoc(id, data, dealer = {}) {
  const { createdAt: _c, ...rest } = data;
  const payload = buildCarDoc(rest, dealer);
  delete payload.createdAt;
  await getProductRef(id).update(payload);
}

export async function deleteCarDoc(id) {
  await getProductRef(id).delete();
}

export async function getCarById(id) {
  const snap = await getProductRef(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
}

/** Fetch all listings for a dealer (new dealerId + legacy userId). */
export async function fetchDealerListings(dealerId) {
  const [byDealer, byUser] = await Promise.all([
    getDealerCarsQuery(dealerId).get().catch(() => ({ docs: [] })),
    productsRef()
      .where('userId', '==', dealerId)
      .orderBy('createdAt', 'desc')
      .get()
      .catch(() => ({ docs: [] })),
  ]);
  const seen = new Set();
  const merged = [];
  [...byDealer.docs, ...byUser.docs].forEach((doc) => {
    if (seen.has(doc.id)) return;
    seen.add(doc.id);
    merged.push({ id: doc.id, ...doc.data() });
  });
  return merged;
}

/** Denormalize dealer profile onto all their listings. */
export async function syncDealerToListings(dealerId, dealer) {
  const listings = await fetchDealerListings(dealerId);
  if (!listings.length) return 0;
  const batch = db.batch();
  const patch = {
    dealerName: dealer.name || '',
    dealershipName: dealer.dealershipName || '',
    dealerWhatsapp: dealer.whatsappNumber || '',
    updatedAt: serverTimestamp(),
  };
  listings.forEach((item) => {
    const ref = getProductRef(item.id);
    const updates = { ...patch };
    if (!item.dealerId) updates.dealerId = dealerId;
    batch.update(ref, updates);
  });
  await batch.commit();
  return listings.length;
}
