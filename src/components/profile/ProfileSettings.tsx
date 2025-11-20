import { useState } from 'react';
import type firebaseCompat from 'firebase/compat/app';
import './ProfileSettings.css';

type MenuItem = {
  title: string;
  path: string;
  icon: string;
  enabled: boolean;
};

const menuList: MenuItem[] = [
  { title: 'Personal information', path: '/personal-information', icon: 'user', enabled: true },
  { title: 'Password & Security', path: '/password-security', icon: 'shield', enabled: false },
  { title: 'Appearance & Theme', path: '/appearance-theme', icon: 'palette', enabled: true },
  { title: 'General Preferences', path: '/general-preferences', icon: 'layers', enabled: true },
  { title: 'Connected Apps', path: '/connected-apps', icon: 'grid', enabled: true },
  { title: 'Notifications', path: '/notifications', icon: 'bell', enabled: true },
  { title: 'API Token', path: '/api-token', icon: 'code', enabled: true },
];

const icons: Record<string, JSX.Element> = {
  user: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  shield: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  palette: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="13.5" cy="6.5" r="1.5"/>
      <circle cx="17.5" cy="10.5" r="1.5"/>
      <circle cx="8.5" cy="7.5" r="1.5"/>
      <circle cx="6.5" cy="12.5" r="1.5"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  ),
  layers: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
  grid: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  bell: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  code: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

type ProfileSettingsProps = {
  user: firebaseCompat.User;
  onSignOut: () => void;
};

export function ProfileSettings({ user, onSignOut }: ProfileSettingsProps) {
  const [selectedPath, setSelectedPath] = useState('/personal-information');

  const displayName = user.displayName ?? user.email ?? 'User';

  const handleItemClick = (item: MenuItem) => {
    if (item.enabled) {
      setSelectedPath(item.path);
    }
  };

  return (
    <div className="profile-settings">
      <div className="profile-menu">
        <h2 className="profile-menu__title">Account settings</h2>

        <div className="profile-menu__items">
          {menuList.map((item) => (
            <button
              key={item.path}
              className={`profile-menu__item ${selectedPath === item.path ? 'selected' : ''} ${!item.enabled ? 'disabled' : ''}`}
              onClick={() => handleItemClick(item)}
              disabled={!item.enabled}
            >
              <span className="profile-menu__icon">{icons[item.icon]}</span>
              <span className="profile-menu__label">{item.title}</span>
            </button>
          ))}
        </div>

        <div className="profile-menu__divider" />

        <button className="profile-menu__logout" onClick={onSignOut}>
          <span className="profile-menu__logout-icon">{icons.logout}</span>
          Logout
        </button>
      </div>

      <div className="profile-content">
        <h1 className="profile-content__title">
          {menuList.find(m => m.path === selectedPath)?.title ?? 'Personal Information'}
        </h1>

        {selectedPath === '/personal-information' && (
          <div className="profile-content__info">
            <div className="profile-content__header">
              <div className="profile-content__cover">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
                  alt="Cover"
                />
              </div>
              <div className="profile-content__avatar">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={displayName} />
                ) : (
                  displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                )}
              </div>
            </div>

            <div className="profile-content__name-row">
              <h2 className="profile-content__name">{displayName}</h2>
              <span className="profile-content__status">Online</span>
            </div>

            <div className="profile-content__section">
              <h3 className="profile-content__section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Contact information
              </h3>

              <div className="profile-content__fields">
                <div className="profile-content__field">
                  <label>FULL NAME</label>
                  <span>{displayName}</span>
                </div>
                <div className="profile-content__field">
                  <label>DATE OF BIRTH</label>
                  <span>Not set</span>
                </div>
                <div className="profile-content__field">
                  <label>NAME DAY</label>
                  <span>Not set</span>
                </div>
                <div className="profile-content__field">
                  <label>COMPANY</label>
                  <span>Not set</span>
                </div>
                <div className="profile-content__field">
                  <label>DEPARTMENT</label>
                  <span>Not set</span>
                </div>
                <div className="profile-content__field">
                  <label>POSITION</label>
                  <span>Not set</span>
                </div>
                <div className="profile-content__field">
                  <label>PRIMARY EMAIL</label>
                  <span>{user.email ?? 'Not set'}</span>
                </div>
                <div className="profile-content__field">
                  <label>MOBILE PHONE</label>
                  <span>Not set</span>
                </div>
              </div>
            </div>

            <div className="profile-content__section">
              <h3 className="profile-content__section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Address
              </h3>
              <div className="profile-content__empty">
                <p><strong>No address added</strong></p>
                <p>Add your address to complete your profile and help others reach you when needed.</p>
              </div>
            </div>

            <div className="profile-content__section">
              <h3 className="profile-content__section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                My Socials
              </h3>
              <div className="profile-content__empty">
                <p><strong>No social links added yet</strong></p>
                <p>Add your social media profiles to make it easier for others to connect with you.</p>
              </div>
            </div>
          </div>
        )}

        {selectedPath !== '/personal-information' && (
          <div className="profile-content__placeholder">
            <p>This section is under development.</p>
          </div>
        )}
      </div>
    </div>
  );
}
