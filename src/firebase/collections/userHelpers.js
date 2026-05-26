/**
 * CARONSELL user helpers (dealers).
 */
import { getUserRef } from './refs';
import { syncDealerToListings } from './productHelpers';
import { serverTimestamp } from './fieldValues';

export async function getUserDoc(userId) {
  const snap = await getUserRef(userId).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
}

export async function ensureUserDoc(authUser, extras = {}) {
  const ref = getUserRef(authUser.uid);
  const doc = await ref.get();
  if (doc.exists) return;
  const now = serverTimestamp();
  await ref.set({
    id: authUser.uid,
    name:
      extras.name != null
        ? String(extras.name).trim()
        : authUser.displayName || authUser.email?.split('@')[0] || 'User',
    email: authUser.email || '',
    avatar: authUser.photoURL || '',
    createdAt: now,
    updatedAt: now,
  });
}

export async function saveDealerProfile(userId, data) {
  const now = serverTimestamp();
  await getUserRef(userId).set(
    {
      role: 'dealer',
      name: (data.name || '').trim(),
      dealershipName: (data.dealershipName || '').trim(),
      city: (data.city || '').trim(),
      whatsappNumber: (data.whatsappNumber || '').trim(),
      updatedAt: now,
    },
    { merge: true }
  );
}

export async function updateDealerProfile(userId, data) {
  const now = serverTimestamp();
  const profile = {
    dealershipName: (data.dealershipName || '').trim(),
    city: (data.city || '').trim(),
    whatsappNumber: (data.whatsappNumber || '').trim(),
    name: (data.name || '').trim(),
    updatedAt: now,
  };
  await getUserRef(userId).update(profile);
  const count = await syncDealerToListings(userId, profile);
  return count;
}
