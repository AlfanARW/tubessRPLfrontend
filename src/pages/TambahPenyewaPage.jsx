import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const TambahPenyewaPage = () => {
    const [form, setForm] = useState({
        nama_lengkap: '',
        no_ktp: '',
        no_sim: '',
        alamat: '',
        no_telepon: '',
        email: '',
        tanggal_pendaftaran: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi
        const kosong = Object.entries(form).find(([key, value]) => !value.trim());
        if (kosong) {
            setError(`Field "${kosong[0].replace('_', ' ')}" tidak boleh kosong.`);
            return;
        }

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/penyewa`, form);
            setSuccess('Data penyewa berhasil disimpan.');
            setForm({
                nama_lengkap: '',
                no_ktp: '',
                no_sim: '',
                alamat: '',
                no_telepon: '',
                email: '',
                tanggal_pendaftaran: ''
            });
        } catch (err) {
            setError('Gagal menyimpan data penyewa.');
            console.error(err);
        }
    };

    return (
        <div className="flex bg-gray-900 text-white min-h-screen font-sans">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">Tambah/Ubah Data Penyewa</h1>
                
                {error && <div className="mb-4 text-red-400">{error}</div>}
                {success && <div className="mb-4 text-green-400">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                    {[
                        { label: 'Nama Lengkap', name: 'nama_lengkap' },
                        { label: 'No. KTP', name: 'no_ktp' },
                        { label: 'No. SIM', name: 'no_sim' },
                        { label: 'Alamat Lengkap', name: 'alamat' },
                        { label: 'Nomor Telepon', name: 'no_telepon' },
                        { label: 'Email', name: 'email' },
                        { label: 'Tanggal Pendaftaran', name: 'tanggal_pendaftaran', type: 'date' },
                    ].map(({ label, name, type = 'text' }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium mb-1">{label}:</label>
                            <input
                                type={type}
                                name={name}
                                value={form[name]}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    ))}

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                        >
                            Simpan
                        </button>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default TambahPenyewaPage;
