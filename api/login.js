// File: /api/login.js

const mysql = require('mysql2/promise'); // Gunakan 'mysql2/promise' untuk async/await
const bcrypt = require('bcryptjs');
const jwt = ('jsonwebtoken');

// Fungsi utama yang akan dijalankan Vercel
export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Buat koneksi database di dalam fungsi
  const db = await mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
  });

  try {
    const { email, password } = req.body;

    // 1. Cari petugas berdasarkan email
    const [rows] = await db.execute('SELECT * FROM petugas WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      await db.end(); // Tutup koneksi
      return res.status(404).json({ message: 'Email tidak ditemukan.' });
    }

    const petugas = rows[0];

    // 2. Bandingkan password
    const isPasswordMatch = await bcrypt.compare(password, petugas.password);
    if (!isPasswordMatch) {
      await db.end(); // Tutup koneksi
      return res.status(401).json({ message: 'Password salah.' });
    }

    // 3. Buat JWT Token
    const token = jwt.sign(
        { id: petugas.id_petugas, nama: petugas.nama_petugas, role: petugas.jabatan },
        process.env.JWT_SECRET, // Gunakan secret key dari environment variable
        { expiresIn: '8h' }
    );

    await db.end(); // Tutup koneksi
    // 4. Kirim respons sukses
    res.status(200).json({ message: 'Login berhasil', token: token });

  } catch (error) {
    await db.end(); // Pastikan koneksi ditutup jika ada error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}