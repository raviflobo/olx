import React, { useContext, useEffect, useState } from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import { AuthContext } from '../../contextStore/AuthContext';
import { getUserDoc } from '../../firebase/collections';
import BarLoading from '../Loading/BarLoading';

function DealerRoute({ children, ...rest }) {
  const { user, authLoading } = useContext(AuthContext);
  const [roleLoading, setRoleLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!user) {
      setRoleLoading(false);
      return;
    }
    getUserDoc(user.uid)
      .then((doc) => setRole(doc?.role || null))
      .catch(() => setRole(null))
      .finally(() => setRoleLoading(false));
  }, [user]);

  if (authLoading || roleLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', minHeight: '50vh', paddingTop: 80 }}>
        <BarLoading />
      </div>
    );
  }

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (!user) {
          return (
            <Redirect
              to={{ pathname: '/dealer/login', state: { from: location } }}
            />
          );
        }
        if (role !== 'dealer') {
          return (
            <div className="cs-auth-page">
              <div className="cs-auth-card" style={{ textAlign: 'center' }}>
                <h2>Access denied</h2>
                <p style={{ color: 'var(--olx-text-muted)' }}>
                  This area is for registered car dealers only.
                </p>
                <Link to="/" className="cs-btn cs-btn--primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                  Back to listings
                </Link>
              </div>
            </div>
          );
        }
        return children;
      }}
    />
  );
}

export default DealerRoute;
