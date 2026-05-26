/**
 * When true, car forms use image URLs only (no Firebase Storage file upload).
 * Set REACT_APP_SKIP_STORAGE_UPLOAD=false after Storage is enabled in Firebase.
 */
export const skipStorageUpload =
  process.env.REACT_APP_SKIP_STORAGE_UPLOAD !== 'false';
