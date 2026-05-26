import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import { AuthContext } from '../contextStore/AuthContext';
import { ToastContext } from '../contextStore/ToastContext';
import { saveDealerProfile } from '../firebase/collections';
import CaronsellLogo from '../Components/UI/CaronsellLogo';
import Input from '../Components/UI/Input';
import Button from '../Components/UI/Button';
import OverlaySpinner from '../Components/Loading/OverlaySpinner';

function DealerOnboarding() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: user?.displayName || '',
    dealershipName: '',
    city: '',
    whatsappNumber: '',
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = 'Name is required';
    if (!form.dealershipName.trim()) err.dealershipName = 'Dealership name is required';
    if (!form.city.trim()) err.city = 'City is required';
    const digits = form.whatsappNumber.replace(/[^0-9]/g, '');
    if (digits.length < 10) err.whatsappNumber = 'Enter a valid WhatsApp number';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || !user) return;
    setLoading(true);
    try {
      await saveDealerProfile(user.uid, form);
      addToast('Dealership profile saved!', 'success');
      history.replace('/dealer/dashboard');
    } catch {
      addToast('Could not save profile.', 'error');
      setLoading(false);
    }
  };

  return (
    <Layout hideHeader hideFooter hideMobileNav>
      <div className="cs-auth-page">
      {loading && <OverlaySpinner />}
      <div className="cs-auth-card">
        <CaronsellLogo asLink={false} />
        <h1 style={{ marginTop: '1.5rem', fontSize: '1.5rem' }}>Set up your dealership</h1>
        <p style={{ color: 'var(--olx-text-muted)', marginBottom: '1.5rem' }}>
          One-time setup to start listing cars.
        </p>
        <form onSubmit={handleSubmit}>
          <Input label="Full name" value={form.name} onChange={set('name')} error={errors.name} />
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
            placeholder="e.g. 919876543210"
          />
          <Button type="submit" variant="primary" block disabled={loading}>
            Complete setup
          </Button>
        </form>
        <Link to="/" className="dealer-login-card__back" style={{ display: 'block', marginTop: '1rem', textAlign: 'center' }}>
          ← Back to listings
        </Link>
      </div>
      </div>
    </Layout>
  );
}

export default DealerOnboarding;
