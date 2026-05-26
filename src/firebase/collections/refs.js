/**
 * Firestore collection references.
 */
import { Firebase } from '../config';

export const db = Firebase.firestore();

export const productsRef = () => db.collection('products');
export const usersRef = () => db.collection('users');

export const getProductRef = (id) => productsRef().doc(id);
export const getUserRef = (userId) => usersRef().doc(userId);
