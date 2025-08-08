import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const EditPenyewaPage = () => {
    const { id } = useParams(); // dari /penyewa/edit/:id
    const navigate = useNavigate();
    const [penyewa, setPenyewa] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPenyewa = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/penyewa/${id}`);
                setPenyewa(res.data);
            } catch (err) {
                setError('Gagal mengambil data penyewa.');
            }
        };
        fetchPenyewa();
    }, [id]);

    const handleChange = (e) => {
        setPenyewa({ ...penyewa, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/penyewa/${id}`, penyewa);
            navigate('/manajemen-penyewa');
        } catch (err) {
            setError('Gagal menyimpan perubahan.');
        }
    };

    if (!penyewa) return <div className="text-white p-8">Memuat data...</div>;

    return (
        <div className="flex bg-gray-900 text-white min-h-screen font-sans">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">
                    Ubah Data Penyewa ({penyewa.nama_lengkap})
                </h1>

                {error && <p className="text-red-400 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
                    {[
                        { label: 'No. SIM', name: 'no_sim' },
                        { label: 'Alamat Lengkap', name: 'alamat' },
                        { label: 'Nomor Telepon', name: 'no_telepon' },
                        { label: 'Email', name: 'email' },
                    ].map(({ label, name }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium mb-1">{label}:</label>
                            <input
                                type="text"
                                name={name}
                                value={penyewa[name] || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            onClick={() => navigate('/manajemen-penyewa')}
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

export default EditPenyewaPage;
