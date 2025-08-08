import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  // Hanya izinkan metode GET untuk endpoint ini
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Buat koneksi ke database Anda
  const db = await mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
  });

  try {
    // Query untuk mengambil beberapa data statistik sekaligus
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM kendaraan WHERE status_ketersediaan = 'tersedia') AS kendaraanTersedia,
            (SELECT COUNT(*) FROM transaksi_sewa WHERE status_transaksi = 'berjalan') AS transaksiAktif,
            (SELECT COUNT(*) FROM penyewa) AS totalPenyewa
    `;

    const [rows] = await db.execute(sql);
    
    // Tutup koneksi setelah selesai
    await db.end();

    // Kirim hasilnya (objek pertama dari array) sebagai respons
    res.status(200).json(rows[0]);

  } catch (error) {
    // Jika ada error, tutup koneksi dan kirim pesan error
    await db.end();
    res.status(500).json({ message: "Gagal mengambil data statistik.", error: error.message });
  }
}