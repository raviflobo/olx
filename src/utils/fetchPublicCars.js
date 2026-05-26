import { productsRef } from '../firebase/collections';
import { normalizeCarList, isPublicCar } from './normalizeCar';

/**
 * Load active cars for buyer views, with legacy OLX fallback query.
 */
export async function fetchPublicCars() {
  try {
    const snap = await productsRef()
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
      .get();
    return normalizeCarList(snap.docs).filter(isPublicCar);
  } catch {
    const snap = await productsRef().orderBy('createdAt', 'desc').limit(80).get();
    return normalizeCarList(snap.docs).filter(isPublicCar);
  }
}
