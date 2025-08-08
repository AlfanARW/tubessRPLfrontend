require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
};

// === KUMPULAN SEMUA API ENDPOINT ===

// POST /api/login
app.post('/api/login', async (req, res) => {
    let db;
    try {
        db = await mysql.createConnection(dbConfig);
        const { email, password } = req.body;
        const [rows] = await db.execute('SELECT * FROM petugas WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(404).json({ message: 'Email tidak ditemukan.' });
        
        const petugas = rows[0];
        const isMatch = await bcrypt.compare(password, petugas.password);
        if (!isMatch) return res.status(401).json({ message: 'Password salah.' });
        
        const token = jwt.sign({ id: petugas.id_petugas }, process.env.JWT_SECRET, { expiresIn: '8h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (db) await db.end();
    }
});

// GET /api/dashboard/statistik
app.get('/api/dashboard/statistik', async (req, res) => {
    let db;
    try {
        db = await mysql.createConnection(dbConfig);
        const sql = `SELECT (SELECT COUNT(*) FROM kendaraan WHERE status_ketersediaan = 'tersedia') AS kendaraanTersedia, (SELECT COUNT(*) FROM transaksi_sewa WHERE status_transaksi = 'berjalan') AS transaksiAktif, (SELECT COUNT(*) FROM penyewa) AS totalPenyewa`;
        const [rows] = await db.execute(sql);
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Statistik error:", error);
        res.status(500).json({ message: 'Gagal mengambil statistik' });
    } finally {
        if (db) await db.end();
    }
});

// GET /api/transaksi/terbaru
app.get('/api/transaksi/terbaru', async (req, res) => {
    console.log('[BACKEND] Menerima permintaan untuk /api/transaksi/terbaru...'); // Penanda 1
    let db;
    try {
        db = await mysql.createConnection(dbConfig);
        console.log('[BACKEND] Koneksi database berhasil.'); // Penanda 2

        const sql = `
            SELECT 
                ts.id_sewa, 
                p.nama_lengkap AS penyewa, 
                k.nama_kendaraan AS kendaraan, 
                ts.total_pembayaran AS total_biaya, 
                ts.status_transaksi AS status 
            FROM transaksi_sewa ts
            JOIN penyewa p ON ts.id_penyewa = p.id_penyewa
            JOIN kendaraan k ON ts.no_polisi = k.no_polisi
            ORDER BY ts.tanggal_mulai_sewa DESC
            LIMIT 5;
        `;
        
        console.log('[BACKEND] Menjalankan query SQL...'); // Penanda 3
        const [rows] = await db.execute(sql);
        console.log('[BACKEND] Query berhasil, jumlah data ditemukan:', rows.length); // Penanda 4

        res.status(200).json(rows);

    } catch (error) {
        // Jika ada error, ini akan muncul di terminal backend
        console.error("!!! [BACKEND] TERJADI ERROR:", error); // Penanda Error
        res.status(500).json({ message: 'Gagal mengambil data transaksi terbaru.' });
    } finally {
        if (db) {
            await db.end();
            console.log('[BACKEND] Koneksi database ditutup.'); // Penanda 5
        }
    }
});

// GET /api/penyewa
app.get('/api/penyewa', async (req, res) => {
    let db;
    try {
        db = await mysql.createConnection(dbConfig);
        const [rows] = await db.execute('SELECT * FROM penyewa ORDER BY id_penyewa DESC');
        res.status(200).json(rows);
    } catch (error) {
        console.error("Penyewa error:", error);
        res.status(500).json({ message: 'Gagal mengambil data penyewa' });
    } finally {
        if (db) await db.end();
    }
});

// POST /api/penyewa
app.post('/api/penyewa', async (req, res) => {
    let db;
    try {
        db = await mysql.createConnection(dbConfig);

        const {
            nama_lengkap,
            no_ktp,
            no_sim,
            alamat,
            no_telepon,
            email,
            tanggal_pendaftaran
        } = req.body;

        await db.execute(`
            INSERT INTO penyewa
            (nama_lengkap, no_ktp, no_sim, alamat, no_telepon, email, tanggal_pendaftaran)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nama_lengkap, no_ktp, no_sim, alamat, no_telepon, email, tanggal_pendaftaran]
        );

        res.status(201).json({ message: 'Penyewa berhasil ditambahkan.' });
    } catch (error) {
        console.error('Error saat menambahkan penyewa:', error);
        res.status(500).json({ message: 'Gagal menambahkan penyewa.' });
    } finally {
        if (db) await db.end();
    }
});

// GET /api/kendaraan
app.get('/api/kendaraan', async (req, res) => {
    let db;
    try {
        db = await mysql.createConnection(dbConfig);
        const [rows] = await db.execute('SELECT * FROM kendaraan ORDER BY nama_kendaraan ASC');
        res.status(200).json(rows);
    } catch (error) {
        console.error("Kendaraan error:", error);
        res.status(500).json({ message: 'Gagal mengambil data kendaraan' });
    } finally {
        if (db) await db.end();
    }
});

// GET /api/petugas
app.get('/api/petugas', async (req, res) => {
    let db;
    try {
        db = await mysql.createConnection(dbConfig);
        const [rows] = await db.execute('SELECT id_petugas, nama_petugas, jabatan, email, status_akun FROM petugas ORDER BY id_petugas ASC');
        res.status(200).json(rows);
    } catch (error) {
        console.error("Petugas error:", error);
        res.status(500).json({ message: 'Gagal mengambil data petugas' });
    } finally {
        if (db) await db.end();
    }
});

app.get('/api/penyewa/:id', async (req, res) => {
    let db;
    try {
        db = await mysql.createConnection(dbConfig);
        const [rows] = await db.execute('SELECT * FROM penyewa WHERE id_penyewa = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Penyewa tidak ditemukan.' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data penyewa.' });
    } finally {
        if (db) await db.end();
    }
});

app.put('/api/penyewa/:id', async (req, res) => {
    let db;
    try {
        db = await mysql.createConnection(dbConfig);
        const { no_sim, alamat, no_telepon, email } = req.body;
        await db.execute(
            `UPDATE penyewa SET no_sim = ?, alamat = ?, no_telepon = ?, email = ? WHERE id_penyewa = ?`,
            [no_sim, alamat, no_telepon, email, req.params.id]
        );
        res.status(200).json({ message: 'Data penyewa diperbarui.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengupdate data penyewa.' });
    } finally {
        if (db) await db.end();
    }
});

// Jalankan server
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`[BACKEND] Server berjalan di http://localhost:${PORT}`);
});