import React, { useState, useEffect } from 'react';
import Input from '../UI/Input';
import Select from '../UI/Select';
import Textarea from '../UI/Textarea';
import Button from '../UI/Button';
import { FUEL_TYPES, TRANSMISSIONS, CONDITIONS } from '../../utils/carFilters';
import { skipStorageUpload } from '../../utils/storageConfig';
import {
  isValidImageUrl,
  parseImageUrls,
  mergeImageUrls,
  MAX_CAR_IMAGES,
} from '../../utils/imageUrls';
import './CarForm.css';

const initial = {
  title: '',
  brand: '',
  model: '',
  year: '',
  price: '',
  mileage: '',
  fuelType: '',
  transmission: '',
  condition: '',
  color: '',
  city: '',
  description: '',
  isActive: true,
};

function CarForm({ initialValues, onSubmit, submitLabel, loading }) {
  const [form, setForm] = useState({ ...initial, ...initialValues });
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(
    initialValues?.imageUrls || []
  );
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [bulkUrlInput, setBulkUrlInput] = useState('');

  const set = (field) => (e) =>
    setForm({
      ...form,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });

  const validate = () => {
    const err = {};
    if (!form.title.trim()) err.title = 'Title is required';
    if (!form.brand.trim()) err.brand = 'Brand is required';
    if (!form.model.trim()) err.model = 'Model is required';
    if (!form.year || Number(form.year) < 1900) err.year = 'Valid year required';
    if (!form.price || Number(form.price) <= 0) err.price = 'Valid price required';
    if (!form.fuelType) err.fuelType = 'Select fuel type';
    if (!form.transmission) err.transmission = 'Select transmission';
    if (!form.condition) err.condition = 'Select condition';
    if (!form.city.trim()) err.city = 'City is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, files, imageUrls: existingImages });
  };

  const removeExisting = (idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const addImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    if (!isValidImageUrl(url)) {
      setErrors((e) => ({ ...e, images: 'URL must start with http:// or https://' }));
      return;
    }
    if (existingImages.length >= MAX_CAR_IMAGES) return;
    setExistingImages((prev) => mergeImageUrls(prev, [url]));
    setImageUrlInput('');
    setErrors((e) => ({ ...e, images: undefined }));
  };

  const addBulkUrls = () => {
    const parsed = parseImageUrls(bulkUrlInput);
    if (!parsed.length) {
      setErrors((e) => ({
        ...e,
        images: 'Paste one or more valid image URLs (one per line).',
      }));
      return;
    }
    setExistingImages((prev) => mergeImageUrls(prev, parsed));
    setBulkUrlInput('');
    setErrors((e) => ({ ...e, images: undefined }));
  };

  const handleFilesPicked = (e) => {
    const picked = Array.from(e.target.files || []).slice(
      0,
      MAX_CAR_IMAGES - existingImages.length - files.length
    );
    setFiles((f) => [...f, ...picked]);
    e.target.value = '';
  };

  const slotsLeft = MAX_CAR_IMAGES - existingImages.length - files.length;

  return (
    <form className="car-form" onSubmit={handleSubmit}>
      <h2 className="cs-section-title">Vehicle details</h2>
      <div className="car-form__grid">
        <Input label="Title" value={form.title} onChange={set('title')} error={errors.title} placeholder="2021 Toyota Fortuner" />
        <Input label="Brand" value={form.brand} onChange={set('brand')} error={errors.brand} />
        <Input label="Model" value={form.model} onChange={set('model')} error={errors.model} />
        <Input label="Year" type="number" value={form.year} onChange={set('year')} error={errors.year} />
        <Input label="Price (₹)" type="number" value={form.price} onChange={set('price')} error={errors.price} />
        <Input label="Mileage (km)" type="number" value={form.mileage} onChange={set('mileage')} />
        <Select label="Fuel type" value={form.fuelType} onChange={set('fuelType')} error={errors.fuelType}>
          <option value="">Select</option>
          {FUEL_TYPES.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </Select>
        <Select label="Transmission" value={form.transmission} onChange={set('transmission')} error={errors.transmission}>
          <option value="">Select</option>
          {TRANSMISSIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
        <Select label="Condition" value={form.condition} onChange={set('condition')} error={errors.condition}>
          <option value="">Select</option>
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <Input label="Color" value={form.color} onChange={set('color')} />
        <Input label="City" value={form.city} onChange={set('city')} error={errors.city} />
      </div>

      <Textarea label="Description" value={form.description} onChange={set('description')} rows={4} />

      <div className="car-form__photos-header">
        <h2 className="cs-section-title">Photos</h2>
        <span className="car-form__photo-count">
          {existingImages.length + files.length} / {MAX_CAR_IMAGES}
        </span>
      </div>
      {skipStorageUpload ? (
        <p className="car-form__storage-hint">
          Add up to {MAX_CAR_IMAGES} photos using image links (one per line). First photo is
          the cover image on listings.
        </p>
      ) : (
        <p className="car-form__storage-hint">
          Upload multiple files or paste image URLs. First photo is the cover.
        </p>
      )}
      {errors.images && <p className="cs-error">{errors.images}</p>}

      <label className="cs-label" htmlFor="bulk-urls">
        Paste multiple image URLs
      </label>
      <textarea
        id="bulk-urls"
        className="cs-textarea car-form__bulk-urls"
        rows={4}
        placeholder={'https://example.com/front.jpg\nhttps://example.com/side.jpg\nhttps://example.com/interior.jpg'}
        value={bulkUrlInput}
        onChange={(e) => setBulkUrlInput(e.target.value)}
        disabled={slotsLeft <= 0}
      />
      <div className="car-form__url-actions">
        <Button
          type="button"
          variant="primary"
          small
          onClick={addBulkUrls}
          disabled={slotsLeft <= 0 || !bulkUrlInput.trim()}
        >
          Add all URLs
        </Button>
      </div>

      <div className="car-form__url-row">
        <input
          type="url"
          className="cs-input"
          placeholder="Or add one URL"
          value={imageUrlInput}
          onChange={(e) => setImageUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
          disabled={slotsLeft <= 0}
        />
        <Button type="button" variant="outline" onClick={addImageUrl} disabled={slotsLeft <= 0}>
          Add one
        </Button>
      </div>

      {!skipStorageUpload && slotsLeft > 0 && (
        <label className="car-form__file-upload cs-btn cs-btn--outline">
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleFilesPicked}
          />
          Choose multiple photos from device
        </label>
      )}

      {(existingImages.length > 0 || files.length > 0) && (
        <div className="car-form__photos">
          {existingImages.map((url, i) => (
            <div key={`${url}-${i}`} className="car-form__photo">
              {i === 0 && <span className="car-form__cover-badge">Cover</span>}
              <span className="car-form__photo-num">{i + 1}</span>
              <img src={url} alt="" onError={(e) => { e.target.style.display = 'none'; }} />
              <button type="button" onClick={() => removeExisting(i)} aria-label="Remove">
                ×
              </button>
            </div>
          ))}
          {files.map((f, i) => (
            <div key={`${f.name}-${i}`} className="car-form__photo car-form__photo--file">
              <span className="car-form__photo-num">{existingImages.length + i + 1}</span>
              <FilePreview file={f} />
              <button
                type="button"
                onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}
          {!skipStorageUpload && slotsLeft > 0 && (
            <label className="car-form__photo-add">
              <input type="file" accept="image/*" multiple hidden onChange={handleFilesPicked} />
              + Add more
            </label>
          )}
        </div>
      )}

      <label className="car-form__active">
        <input type="checkbox" checked={form.isActive} onChange={set('isActive')} />
        Listing is active (visible to buyers)
      </label>

      <div className="car-form__actions">
        <Button type="submit" variant="primary" block disabled={loading}>
          {loading ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function FilePreview({ file }) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  if (!src) return <span className="car-form__file-name">{file.name}</span>;
  return <img src={src} alt="" />;
}

export default CarForm;
