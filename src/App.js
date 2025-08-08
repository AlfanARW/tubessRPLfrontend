import React from 'react';
import LoginPage from './pages/LoginPage'; // 1. Impor halaman login
import './index.css'; // Pastikan file CSS utama diimpor

function App() {
  // 2. Tampilkan komponen LoginPage
  return (
    <div className="App">
      <LoginPage />
    </div>
  );
}

export default App;