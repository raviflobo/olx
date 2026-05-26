import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { AuthContext } from '../contextStore/AuthContext';
import { ToastContext } from '../contextStore/ToastContext';
import { getCarById, updateCarDoc, getUserDoc } from '../firebase/collections';
import { resolveCarImageUrls } from '../utils/resolveCarImages';
import Layout from '../Components/Layout/Layout';
import CarForm from '../Components/CarForm/CarForm';
import OverlaySpinner from '../Components/Loading/OverlaySpinner';
import BarLoading from '../Components/Loading/BarLoading';

function EditCar() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const history = useHistory();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getCarById(id)
      .then((data) => {
        if (!data || data.dealerId !== user?.uid) {
          history.replace('/dealer/dashboard');
          return;
        }
        setCar(data);
      })
      .finally(() => setFetching(false));
  }, [id, user, history]);

  const handleSubmit = async (form) => {
    if (!user || !car) return;
    setLoading(true);
    try {
      const dealer = await getUserDoc(user.uid);
      const imageUrls = await resolveCarImageUrls(form, user.uid);
      await updateCarDoc(
        id,
        {
          ...form,
          dealerId: user.uid,
          dealerName: dealer?.name || '',
          dealershipName: dealer?.dealershipName || '',
          dealerWhatsapp: dealer?.whatsappNumber || '',
          year: Number(form.year),
          price: Number(form.price),
          mileage: Number(form.mileage) || 0,
          imageUrls,
          createdAt: car.createdAt,
        },
        dealer
      );
      addToast('Listing updated!', 'success');
      history.push('/dealer/dashboard');
    } catch {
      addToast('Could not update listing.', 'error');
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Layout>
        <div className="cs-page"><BarLoading /></div>
      </Layout>
    );
  }

  return (
    <Layout>
      {loading && <OverlaySpinner />}
      <div className="cs-page cs-container">
        <h1 className="cs-page-header__title">Edit listing</h1>
        <CarForm
          initialValues={car}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </Layout>
  );
}

export default EditCar;
