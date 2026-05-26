import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Firebase } from '../firebase/config';
import { ensureUserDoc } from '../firebase/collections';
import { signInWithPopup, getGoogleProvider } from '../firebase/auth';
import { AuthContext } from '../contextStore/AuthContext';
import { ToastContext } from '../contextStore/ToastContext';
import { resolveDealerRedirect } from '../utils/dealerAuth';
import { validateEmail, validatePassword } from '../utils/validation';
import CaronsellLogo from '../Components/UI/CaronsellLogo';
import Input from '../Components/UI/Input';
import Button from '../Components/UI/Button';
import OverlaySpinner from '../Components/Loading/OverlaySpinner';
import './DealerLogin.css';

function DealerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);

  React.useEffect(() => {
    if (user) {
      resolveDealerRedirect(user.uid).then((path) => {
        if (path) history.replace(path);
      });
    }
  }, [user, history]);

  const afterAuth = async (authUser) => {
    await ensureUserDoc(authUser);
    const path = await resolveDealerRedirect(authUser.uid);
    if (path) {
      addToast('Welcome!', 'success');
      history.replace(path);
    } else {
      addToast('Account not authorized for dealer access.', 'error');
    }
  };

  const handleGoogle = () => {
    setLoading(true);
    signInWithPopup(getGoogleProvider())
      .then((r) => ensureUserDoc(r.user).then(() => afterAuth(r.user)))
      .catch(() => {
        setErrors({ form: 'Google sign-in failed.' });
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = {};
    const eErr = validateEmail(email);
    if (eErr) err.email = eErr;
    const pErr = validatePassword(password, { requireStrength: false, minLength: 6 });
    if (pErr) err.password = pErr;
    setErrors(err);
    if (Object.keys(err).length) return;

    setLoading(true);
    const auth = isRegister
      ? Firebase.auth().createUserWithEmailAndPassword(email, password)
      : Firebase.auth().signInWithEmailAndPassword(email, password);

    auth
      .then((cred) => ensureUserDoc(cred.user).then(() => afterAuth(cred.user)))
      .catch(() => {
        setErrors({
          form: isRegister
            ? 'Could not create account. Email may already be in use.'
            : 'Invalid email or password.',
        });
        setLoading(false);
      });
  };

  return (
    <div className="cs-auth-page">
      {loading && <OverlaySpinner />}
      <div className="cs-auth-card dealer-login-card">
        <div className="dealer-login-card__logo">
          <CaronsellLogo asLink={false} />
        </div>
        <h1 className="dealer-login-card__title">Dealer Login</h1>
        <p className="dealer-login-card__sub">Manage your car listings</p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
          />
          {errors.form && <p className="cs-error">{errors.form}</p>}
          {!isRegister && (
            <Link to="/forgot-password" className="dealer-login-card__forgot">
              Forgot password?
            </Link>
          )}
          <Button type="submit" variant="primary" block disabled={loading}>
            {isRegister ? 'Create account' : 'Sign in'}
          </Button>
        </form>

        <Button
          type="button"
          variant="outline"
          block
          className="dealer-login-card__google"
          onClick={handleGoogle}
          disabled={loading}
        >
          Continue with Google
        </Button>

        <button
          type="button"
          className="dealer-login-card__toggle"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? 'Already have an account? Sign in' : 'New dealer? Create account'}
        </button>

        <Link to="/" className="dealer-login-card__back">
          ← Back to car listings
        </Link>
      </div>
    </div>
  );
}

export default DealerLogin;
