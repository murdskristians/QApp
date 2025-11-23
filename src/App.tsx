import { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import { Sidebar } from './components/sidebar/Sidebar';
import { MainPanelWrapper } from './pages/user-info/MainPanelWrapper';
import { SmartSuitePage } from './pages/smartsuite/SmartSuitePage';
import { ProfileContact } from './types/profile';
import {
  Workspace,
  NotificationProvider,
} from 'module-react-firebase-chat-app-poc';
import 'module-react-firebase-chat-app-poc/dist/module-react-firebase-chat-app-poc.css';

import {
  type FirebaseUser,
  subscribeToAuthChanges,
  signOut,
} from './firebase/auth';

import './App.css';

type ActiveView = 'chat' | 'profile' | 'smartsuite';

// Create profile contact from Firebase user
const createProfileContact = (user: FirebaseUser): ProfileContact => ({
  id: user.uid,
  name: user.displayName ?? user.email?.split('@')[0] ?? 'User',
  email: user.email,
  avatarUrl: user.photoURL,
  avatarColor: null,
  statusMessage: 'Online',
  company: 'Piche Communications',
  department: { name: 'Customer Success' },
  position: { jobTitle: 'Account Executive' },
  additionalEmails: [],
  phoneNumbers: [],
  address: null,
  socialLinks: [],
  coverImageUrl: null,
});

const SELECTED_VERSION_KEY = 'chat-package-version';

function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<ActiveView>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const prevUserRef = useRef<FirebaseUser | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string>(() => {
    return localStorage.getItem(SELECTED_VERSION_KEY) || '';
  });

  const handleVersionChange = (version: string) => {
    setSelectedVersion(version);
    localStorage.setItem(SELECTED_VERSION_KEY, version);
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      const wasLoggedOut = !prevUserRef.current && currentUser;
      prevUserRef.current = currentUser;
      setUser(currentUser);
      setIsLoading(false);
      // При логине всегда открываем чат
      if (wasLoggedOut) {
        setActiveView('chat');
      }
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/auth/register"
          element={user ? <Navigate to="/" replace /> : <Register />}
        />
        <Route
          path="/auth/reset-password"
          element={user ? <Navigate to="/" replace /> : <ResetPassword />}
        />

        <Route
          path="/"
          element={
            user ? (
              <div className="app-layout">
                <Sidebar
                  user={user}
                  activeView={activeView}
                  onSelectView={(view) => {
                    setActiveView(view);
                    setIsSidebarOpen(false);
                  }}
                  selectedVersion={selectedVersion}
                  onVersionChange={handleVersionChange}
                  isOpen={isSidebarOpen}
                  onClose={() => setIsSidebarOpen(false)}
                />
                {isSidebarOpen && (
                  <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                  />
                )}
                {!isSidebarOpen && (
                  <button
                    className="sidebar-toggle-button"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Open sidebar"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 4L8 8L4 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
                <section className="app-layout__profile-view">
                  {activeView === 'profile' ? (
                    <MainPanelWrapper
                      profileContact={createProfileContact(user)}
                      isLoading={false}
                      onSignOut={handleSignOut}
                      onBackToChat={() => setActiveView('chat')}
                    />
                  ) : activeView === 'smartsuite' ? (
                    <SmartSuitePage />
                  ) : (
                    <NotificationProvider>
                      <Workspace user={user} onSignOut={handleSignOut} />
                    </NotificationProvider>
                  )}
                </section>
              </div>
            ) : (
              <Navigate to="/auth/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
