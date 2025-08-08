import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import './index.css';

// Komponen ini bertugas melindungi halaman dashboard.
// Ia akan memeriksa apakah ada token login di browser.
function PrivateRoute({ children }) {
  const token = localStorage.getItem('authToken');
  
  // Jika ada token, izinkan akses ke halaman (children).
  // Jika tidak ada, "tendang" kembali ke halaman login ('/').
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute untuk halaman utama ('/'), akan menampilkan LoginPage */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Rute untuk halaman '/dashboard' */}
        <Route 
          path="/dashboard" 
          element={
            // Halaman ini dilindungi oleh PrivateRoute
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;