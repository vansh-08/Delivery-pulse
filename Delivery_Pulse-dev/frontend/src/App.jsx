
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DSRFormPage from './pages/DSRFormPage';
import EditDSRPage from './pages/EditDSRPage';
import HistoryPage from './pages/HistoryPage';
import SuccessPage from './pages/SuccessPage';
import ProtectedLayout from './components/ProtectedLayout';
import ResourceUpload from './components/uploadExcel';
import { authAPI } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await authAPI.getUser();
      if (response.success) {
        setUser(response.user);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
    <Routes>
        {/* Public route */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dsr" replace /> : <LoginPage />}
        />

        {/* Protected routes – all share the same Navbar via ProtectedLayout */}
        <Route
          element={
            user ? (
              <ProtectedLayout user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="/dsr" element={<DSRFormPage />} />
          <Route path="/dsr/edit/:id" element={<EditDSRPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/success" element={<SuccessPage />} />

          <Route path="/admin" element={<ResourceUpload />} />
          <Route path="/" element={<Navigate to="/dsr" replace />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={user ? "/dsr" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

