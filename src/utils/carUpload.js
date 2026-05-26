import { Firebase } from '../firebase/config';

const MAX_IMAGES = 10;

export async function uploadCarImages(files, dealerId) {
  const list = Array.from(files).slice(0, MAX_IMAGES);
  const urls = [];
  for (const file of list) {
    const ref = Firebase.storage()
      .ref(`products/${dealerId}/${Date.now()}_${file.name}`);
    await ref.put(file);
    const url = await ref.getDownloadURL();
    urls.push(url);
  }
  return urls;
}
