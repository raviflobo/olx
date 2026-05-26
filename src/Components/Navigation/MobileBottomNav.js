import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contextStore/AuthContext';
import { getUserDoc } from '../../firebase/collections';
import {
  NavHomeIcon,
  NavSearchIcon,
  NavDashboardIcon,
  NavDealerIcon,
} from './NavIcons';
import './MobileBottomNav.css';

function MobileBottomNav() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const path = location.pathname;
  const [isDealer, setIsDealer] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsDealer(false);
      return;
    }
    getUserDoc(user.uid).then((doc) => setIsDealer(doc?.role === 'dealer'));
  }, [user]);

  const items = [
    {
      to: '/',
      label: 'Home',
      Icon: NavHomeIcon,
      isActive: path === '/',
    },
    {
      to: '/search',
      label: 'Search',
      Icon: NavSearchIcon,
      isActive: path.startsWith('/search'),
    },
  ];

  if (isDealer) {
    items.push({
      to: '/dealer/dashboard',
      label: 'Dashboard',
      Icon: NavDashboardIcon,
      isActive: path.startsWith('/dealer'),
    });
  } else {
    items.push({
      to: '/dealer/login',
      label: 'Dealer',
      Icon: NavDealerIcon,
      isActive: path.startsWith('/dealer'),
    });
  }

  return (
    <nav className="mobileBottomNav" aria-label="Main navigation">
      {items.map(({ to, label, Icon, isActive }) => (
        <Link
          key={to}
          to={to}
          className={`mobileBottomNavItem ${isActive ? 'active' : ''}`}
          aria-current={isActive ? 'page' : undefined}
        >
          <span className="mobileBottomNavIcon">
            <Icon active={isActive} />
          </span>
          <span className="mobileBottomNavLabel">{label}</span>
        </Link>
      ))}
    </nav>
  );
}

export default MobileBottomNav;
