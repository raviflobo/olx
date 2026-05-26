import { getUserDoc } from '../firebase/collections';

export async function resolveDealerRedirect(uid) {
  const doc = await getUserDoc(uid);
  if (doc?.role === 'dealer') return '/dealer/dashboard';
  if (!doc?.role) return '/dealer/onboarding';
  return null;
}
