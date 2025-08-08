import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ManajemenPenyewaPage = () => {
    const [penyewa, setPenyewa] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPenyewa = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/penyewa`);
                setPenyewa(response.data);
            } catch (err) {
                setError('Gagal memuat data penyewa.');
            } finally {
                setLoading(false);
            }
        };
        fetchPenyewa();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="flex bg-gray-900 text-white min-h-screen font-sans">
            <Sidebar />

            <main className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">Manajemen Data Penyewa</h1>

                {/* Tombol Aksi dan Pencarian */}
                <div className="flex justify-between items-center mb-6">
    <button
        onClick={() => navigate('/penyewa/tambah')}
        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
    >
        <FiPlus className="mr-2" />
        Tambah Penyewa Baru
    </button>
    <div className="relative">
        <input
            type="text"
            placeholder="Cari penyewa..."
            className="bg-gray-700 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
</div>


                {/* Tabel Data */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-700 text-gray-400 uppercase">
                            <tr>
                                <th className="p-4">ID Penyewa</th>
                                <th className="p-4">Nama Lengkap</th>
                                <th className="p-4">No. KTP</th>
                                <th className="p-4">No. SIM</th>
                                <th className="p-4">Alamat</th>
                                <th className="p-4">No. Telepon</th>
                                <th className="p-4">Tgl. Daftar</th>
                                <th className="p-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8" className="text-center p-4">Memuat data...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="8" className="text-center p-4 text-red-400">{error}</td></tr>
                            ) : (
                                penyewa.map((item) => (
                                    <tr key={item.id_penyewa} className="border-b border-gray-700 last:border-none hover:bg-gray-700/50">
                                        <td className="p-4 font-mono">P{String(item.id_penyewa).padStart(4, '0')}</td>
                                        <td className="p-4 font-semibold">{item.nama_lengkap}</td>
                                        <td className="p-4">{item.no_ktp}</td>
                                        <td className="p-4">{item.no_sim}</td>
                                        <td className="p-4 max-w-xs truncate">{item.alamat}</td>
                                        <td className="p-4">{item.no_telepon}</td>
                                        <td className="p-4">{formatDate(item.tanggal_pendaftaran)}</td>
                                        <td className="p-4 flex gap-2">
                                            <button
                                            onClick={() => navigate(`/penyewa/edit/${item.id_penyewa}`)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded"
                                            >
                                                EDIT
                                            </button>

                                            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">HAPUS</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default ManajemenPenyewaPage;