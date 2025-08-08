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

app.post('/api/login', async (req, res) => {
    let db;
    try {
        db = await mysql.createConnection(dbConfig);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password harus diisi.' });
        }

        const [rows] = await db.execute('SELECT * FROM petugas WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Email tidak ditemukan.' });
        }

        const petugas = rows[0];
        const isPasswordMatch = await bcrypt.compare(password, petugas.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Password salah.' });
        }

        const token = jwt.sign(
            { id: petugas.id_petugas, nama: petugas.nama_petugas, role: petugas.jabatan },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );
        
        res.status(200).json({ message: 'Login berhasil', token });

    } catch (error) {
        console.error("Kesalahan pada server backend:", error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    } finally {
        if (db) await db.end();
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`[BACKEND] Server berjalan di http://localhost:${PORT}`);
});