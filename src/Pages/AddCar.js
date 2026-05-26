import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../contextStore/AuthContext';
import { ToastContext } from '../contextStore/ToastContext';
import { createCarDoc, getUserDoc } from '../firebase/collections';
import { resolveCarImageUrls } from '../utils/resolveCarImages';
import { skipStorageUpload } from '../utils/storageConfig';
import Layout from '../Components/Layout/Layout';
import CarForm from '../Components/CarForm/CarForm';
import OverlaySpinner from '../Components/Loading/OverlaySpinner';

function AddCar() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form) => {
    if (!user) return;
    setLoading(true);
    try {
      const dealer = await getUserDoc(user.uid);
      const imageUrls = await resolveCarImageUrls(form, user.uid);
      await createCarDoc(
        {
          ...form,
          dealerId: user.uid,
          dealerName: dealer?.name || user.displayName || '',
          dealershipName: dealer?.dealershipName || '',
          dealerWhatsapp: dealer?.whatsappNumber || '',
          year: Number(form.year),
          price: Number(form.price),
          mileage: Number(form.mileage) || 0,
          imageUrls,
        },
        dealer
      );
      addToast('Car listed successfully!', 'success');
      history.push('/dealer/dashboard');
    } catch (err) {
      console.error(err);
      addToast('Could not save listing.', 'error');
      setLoading(false);
    }
  };

  return (
    <Layout>
      {loading && <OverlaySpinner />}
      <div className="cs-page cs-container">
        <h1 className="cs-page-header__title">Add new car</h1>
        {skipStorageUpload && (
          <p className="car-form__storage-hint" style={{ marginBottom: '1rem' }}>
            Photo upload via Firebase Storage is disabled. Add image URLs or publish without photos.
          </p>
        )}
        <CarForm submitLabel="Publish listing" onSubmit={handleSubmit} loading={loading} />
      </div>
    </Layout>
  );
}

export default AddCar;
