import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ManajemenPenyewaPage from './pages/ManajemenPenyewaPage';
import ManajemenKendaraanPage from './pages/ManajemenKendaraanPage';
import ManajemenPetugasPage from './pages/ManajemenPetugasPage';
import TambahPenyewaPage from './pages/TambahPenyewaPage';
import EditPenyewaPage from './pages/EditPenyewaPage';
import './index.css';

// Komponen ini berfungsi untuk melindungi sebuah halaman.
// Ia akan memeriksa apakah ada token login di browser.
function PrivateRoute({ children }) {
  const token = localStorage.getItem('authToken');
  
  // Jika ada token, izinkan akses ke halaman yang dituju.
  // Jika tidak ada, alihkan pengguna kembali ke halaman login ('/').
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute untuk halaman utama, akan menampilkan halaman Login */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Rute untuk halaman-halaman yang memerlukan login */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/manajemen-penyewa" 
          element={
            <PrivateRoute>
              <ManajemenPenyewaPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/penyewa/tambah" 
          element={
            <PrivateRoute>
              <TambahPenyewaPage />
           </PrivateRoute>
          }
        />
        <Route
          path="/penyewa/edit/:id"
          element={
            <PrivateRoute>
              <EditPenyewaPage />
            </PrivateRoute>
          }
        />

        <Route 
          path="/manajemen-kendaraan" 
          element={
            <PrivateRoute>
              <ManajemenKendaraanPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/manajemen-petugas" 
          element={
            <PrivateRoute>
              <ManajemenPetugasPage />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;