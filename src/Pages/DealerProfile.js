import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../contextStore/AuthContext';
import { ToastContext } from '../contextStore/ToastContext';
import { getUserDoc, updateDealerProfile } from '../firebase/collections';
import Layout from '../Components/Layout/Layout';
import Input from '../Components/UI/Input';
import Button from '../Components/UI/Button';
import OverlaySpinner from '../Components/Loading/OverlaySpinner';
import BarLoading from '../Components/Loading/BarLoading';
import { signOut } from '../firebase/auth';
import './DealerProfile.css';

function DealerProfile() {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    dealershipName: '',
    city: '',
    whatsappNumber: '',
  });

  useEffect(() => {
    if (!user) return;
    getUserDoc(user.uid)
      .then((doc) => {
        if (doc) {
          setForm({
            dealershipName: doc.dealershipName || '',
            city: doc.city || '',
            whatsappNumber: doc.whatsappNumber || '',
          });
        }
      })
      .finally(() => setFetching(false));
  }, [user]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.dealershipName.trim()) err.dealershipName = 'Required';
    if (!form.city.trim()) err.city = 'Required';
    if (form.whatsappNumber.replace(/[^0-9]/g, '').length < 10) {
      err.whatsappNumber = 'Valid WhatsApp required';
    }
    setErrors(err);
    if (Object.keys(err).length || !user) return;

    setLoading(true);
    try {
      const synced = await updateDealerProfile(user.uid, {
        ...form,
        name: user.displayName || '',
      });
      addToast(
        synced > 0
          ? `Profile updated. ${synced} listing(s) synced.`
          : 'Profile updated.',
        'success'
      );
    } catch {
      addToast('Could not save profile.', 'error');
    }
    setLoading(false);
  };

  return (
    <Layout>
      {loading && <OverlaySpinner />}
      <div className="cs-page cs-container">
        <h1 className="cs-page-header__title">Dealer profile</h1>
        {fetching ? (
          <BarLoading />
        ) : (
          <form className="cs-auth-card" style={{ maxWidth: 480 }} onSubmit={handleSubmit}>
            <Input
              label="Dealership name"
              value={form.dealershipName}
              onChange={set('dealershipName')}
              error={errors.dealershipName}
            />
            <Input label="City" value={form.city} onChange={set('city')} error={errors.city} />
            <Input
              label="WhatsApp number"
              value={form.whatsappNumber}
              onChange={set('whatsappNumber')}
              error={errors.whatsappNumber}
            />
            <Button type="submit" variant="primary" block disabled={loading}>
              Save changes
            </Button>
            <Button
              type="button"
              variant="outline"
              block
              className="dealer-profile__logout"
              onClick={() => signOut().then(() => history.push('/'))}
            >
              Log out
            </Button>
          </form>
        )}
      </div>
    </Layout>
  );
}

export default DealerProfile;
