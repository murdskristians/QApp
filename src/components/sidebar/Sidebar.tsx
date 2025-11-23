import { useState, useEffect, useRef } from 'react';
import type firebaseCompat from 'firebase/compat/app';
import { useTheme } from '../../hooks/useTheme';
import './Sidebar.css';

type ActiveView = 'chat' | 'profile' | 'smartsuite';

type SidebarProps = {
  user: firebaseCompat.User;
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  selectedVersion: string;
  onVersionChange: (version: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
};

export function Sidebar({ user, activeView, onSelectView, selectedVersion, onVersionChange, isOpen, onClose }: SidebarProps) {
  const displayName = user.displayName ?? user.email ?? 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const { isDark, toggleTheme } = useTheme();

  const [showVersionDropdown, setShowVersionDropdown] = useState(false);
  const [versions, setVersions] = useState<string[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch versions from npm registry (Verdaccio or npmjs.com)
  const fetchVersions = async () => {
    setIsLoadingVersions(true);
    try {
      // Use environment variable or fallback to public npm registry
      const registryUrl = process.env.REACT_APP_NPM_REGISTRY_URL || 'https://registry.npmjs.org';
      const packageName = 'module-react-firebase-chat-app-poc';
      const response = await fetch(`${registryUrl}/${packageName}`);
      if (response.ok) {
        const data = await response.json();
        const versionList = Object.keys(data.versions || {}).sort((a, b) => {
          // Sort versions in descending order (newest first)
          const partsA = a.split('.').map(Number);
          const partsB = b.split('.').map(Number);
          for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
            const diff = (partsB[i] || 0) - (partsA[i] || 0);
            if (diff !== 0) return diff;
          }
          return 0;
        });
        setVersions(versionList);
      } else {
        console.error('Failed to fetch versions from registry:', response.statusText);
        setVersions([]);
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
      setVersions([]);
    } finally {
      setIsLoadingVersions(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowVersionDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVersionButtonClick = () => {
    if (!showVersionDropdown) {
      fetchVersions();
    }
    setShowVersionDropdown(!showVersionDropdown);
  };

  const handleVersionSelect = (version: string) => {
    onVersionChange(version);
    setShowVersionDropdown(false);
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      {onClose && (
        <button
          className="sidebar__close-button"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      <button
        onClick={toggleTheme}
        className="sidebar__theme-toggle"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <nav className="sidebar__nav">
        <button
          className={`sidebar__nav-item ${activeView === 'chat' ? 'active' : ''}`}
          onClick={() => onSelectView('chat')}
        >
          <div className="sidebar__chat-icon">
            <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="12" fill="url(#chat-gradient)"/>
              <path d="M26.88 13.63C25.93 12.6 24.75 11.8 23.45 11.28C22.14 10.76 20.73 10.55 19.33 10.65C16.94 10.85 14.72 11.95 13.1 13.72C11.49 15.49 10.6 17.81 10.63 20.21V28.75C10.63 28.87 10.66 28.99 10.73 29.1C10.8 29.2 10.9 29.28 11.01 29.33C11.09 29.36 11.17 29.37 11.25 29.37C11.42 29.37 11.57 29.31 11.69 29.19L13.17 27.71C13.35 27.54 13.59 27.43 13.84 27.42C14.09 27.4 14.34 27.47 14.54 27.62C16.43 28.98 18.75 29.59 21.06 29.33C23.37 29.07 25.5 27.96 27.04 26.21C28.58 24.47 29.42 22.22 29.39 19.89C29.36 17.57 28.46 15.34 26.88 13.63Z" fill="white"/>
              <defs>
                <linearGradient id="chat-gradient" x1="0" y1="1.77" x2="47.7" y2="22.14" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3ED0DD"/>
                  <stop offset="1" stopColor="#33ADB8"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="sidebar__nav-label">Chat</span>
        </button>

        <div className="sidebar__version-selector" ref={dropdownRef}>
          <button
            className="sidebar__version-button"
            onClick={handleVersionButtonClick}
            title="Select chat package version"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="sidebar__version-label">
            {selectedVersion || 'Version'}
          </span>

          {showVersionDropdown && (
            <div className="sidebar__version-dropdown">
              {isLoadingVersions ? (
                <div className="sidebar__version-loading">Loading...</div>
              ) : versions.length === 0 ? (
                <div className="sidebar__version-empty">No versions found</div>
              ) : (
                versions.map((version) => (
                  <button
                    key={version}
                    className={`sidebar__version-option ${version === selectedVersion ? 'selected' : ''}`}
                    onClick={() => handleVersionSelect(version)}
                  >
                    {version}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <button
          className={`sidebar__nav-item ${activeView === 'smartsuite' ? 'active' : ''}`}
          onClick={() => onSelectView('smartsuite')}
        >
          <div className="sidebar__smartsuite-icon">
            <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="12" fill="url(#smartsuite-gradient)"/>
              <path d="M20 10L11 15V21C11 25.42 14.11 29.54 18.5 30.5C22.89 29.54 26 25.42 26 21V15L20 10Z" fill="white" stroke="white" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 13L14 16V21C14 23.83 16.24 26.53 19 27.24C21.76 26.53 24 23.83 24 21V16L20 13Z" fill="url(#smartsuite-gradient)" stroke="white" strokeWidth="0.5"/>
              <defs>
                <linearGradient id="smartsuite-gradient" x1="0" y1="1.77" x2="47.7" y2="22.14" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8B5CF6"/>
                  <stop offset="1" stopColor="#6D28D9"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="sidebar__nav-label">SmartSuite</span>
        </button>
      </nav>

      <button
        className={`sidebar__profile ${activeView === 'profile' ? 'active' : ''}`}
        onClick={() => onSelectView('profile')}
      >
        <div className="sidebar__avatar">
          {user.photoURL ? (
            <img src={user.photoURL} alt={displayName} />
          ) : (
            initials
          )}
        </div>
        <span className="sidebar__profile-name">{displayName}</span>
      </button>
    </aside>
  );
}