import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SongPage } from './pages/SongPage';
import { AddSongPage } from './pages/AddSongPage';
import { EditSongPage } from './pages/EditSongPage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';
import { useAuth } from './contexts/AuthContext';
import { ArtistPage } from './pages/ArtistPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="text-center py-12">Загрузка...</div>;

  return user ? <>{children}</> : <LoginPage />;
};

export default function () {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/songs/:id" element={<SongPage />} />
      <Route path="/artist/:name" element={<ArtistPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/add"
        element={
          <ProtectedRoute>
            <AddSongPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <ProtectedRoute>
            <EditSongPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
