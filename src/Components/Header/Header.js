import React, { useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './Header.css';
import CaronsellLogo from '../UI/CaronsellLogo';
import { AuthContext } from '../../contextStore/AuthContext';
import { getUserDoc } from '../../firebase/collections';
import { signOut } from '../../firebase/auth';

function Header() {
  const headerRef = React.useRef(null);
  const history = useHistory();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [isDealer, setIsDealer] = React.useState(false);
  const [q, setQ] = React.useState('');

  React.useEffect(() => {
    const node = headerRef.current;
    if (!node) return undefined;

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty(
        '--app-header-height',
        `${node.offsetHeight}px`
      );
    };

    syncHeaderHeight();
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(node);
    window.addEventListener('resize', syncHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncHeaderHeight);
    };
  }, [user, isDealer]);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQ(params.get('q') || '');
  }, [location.search]);

  React.useEffect(() => {
    if (!user) {
      setIsDealer(false);
      return;
    }
    getUserDoc(user.uid).then((doc) => setIsDealer(doc?.role === 'dealer'));
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = q.trim();
    history.push(term ? `/search?q=${encodeURIComponent(term)}` : '/search');
  };

  const handleLogout = () => {
    signOut().then(() => history.push('/'));
  };

  return (
    <header ref={headerRef} className="headerParentDiv">
      <div className="headerChildDiv cs-container">
        <CaronsellLogo />
        <form className="headerSearchForm" onSubmit={handleSearch}>
          <input
            type="search"
            className="headerSearchInput"
            placeholder="Search cars…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search cars"
          />
        </form>
        {user && (
          <div className="headerAuthActions">
            {isDealer && (
              <button
                type="button"
                className="headerDashboardBtn"
                onClick={() => history.push('/dealer/dashboard')}
              >
                Dashboard
              </button>
            )}
            <button
              type="button"
              className="headerLogoutBtn"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
