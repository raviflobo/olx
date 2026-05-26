import { skipStorageUpload } from './storageConfig';
import { uploadCarImages } from './carUpload';

export async function resolveCarImageUrls(form, dealerId) {
  const urls = [...(form.imageUrls || [])];
  if (skipStorageUpload || !form.files?.length) {
    return urls;
  }
  const uploaded = await uploadCarImages(form.files, dealerId);
  return [...urls, ...uploaded];
}
