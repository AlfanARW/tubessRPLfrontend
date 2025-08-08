import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const db = await mysql.createConnection(process.env.DATABASE_URL || {
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
  });

  try {
    // Ambil semua data KECUALI password
    const sql = `
      SELECT id_petugas, nama_petugas, jabatan, email, status_akun 
      FROM petugas 
      ORDER BY id_petugas ASC
    `;
    
    const [rows] = await db.execute(sql);
    await db.end();
    
    res.status(200).json(rows);

  } catch (error) {
    await db.end();
    res.status(500).json({ message: "Gagal mengambil data petugas.", error: error.message });
  }
}