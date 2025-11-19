import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import { Sidebar } from './components/sidebar/Sidebar';

import './App.css';

import {
  type FirebaseUser,
  subscribeToAuthChanges,
  signOut,
} from './firebase/auth';

function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
              <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
                <Sidebar user={user} />
                <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
                  <p>Welcome! You are logged in.</p>
                  <button onClick={handleSignOut}>Sign Out</button>
                </div>
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

