import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import { Sidebar } from './components/sidebar/Sidebar';
import { MainPanelWrapper } from './pages/user-info/MainPanelWrapper';
import { ProfileContact } from './types/profile';

import {
  type FirebaseUser,
  subscribeToAuthChanges,
  signOut,
} from './firebase/auth';

import './App.css';

type ActiveView = 'chat' | 'profile';

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

function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<ActiveView>('profile');

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
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
                <Sidebar user={user} activeView={activeView} onSelectView={setActiveView} />
                <section className="app-layout__profile-view">
                  {activeView === 'profile' ? (
                    <MainPanelWrapper
                      profileContact={createProfileContact(user)}
                      isLoading={false}
                      onSignOut={handleSignOut}
                    />
                  ) : (
                    <div>
                      <p>Chat view coming soon...</p>
                    </div>
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

