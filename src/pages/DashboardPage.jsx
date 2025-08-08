import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const apiBaseUrl = process.env.REACT_APP_API_URL;
            try {
                const [statsRes, transactionsRes] = await Promise.all([
                    axios.get(`${apiBaseUrl}/api/dashboard/statistik`),
                    axios.get(`${apiBaseUrl}/api/transaksi/terbaru`)
                ]);

                setStats(statsRes.data);
                setTransactions(transactionsRes.data);
            } catch (err) {
                setError('Gagal memuat data. Periksa kembali koneksi dan alamat API.');
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const getStatusClass = (status) => {
        switch (status) {
            case 'berjalan': return 'bg-yellow-500/20 text-yellow-300';
            case 'selesai': return 'bg-green-500/20 text-green-300';
            case 'dibatalkan': return 'bg-red-500/20 text-red-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    const formatCurrency = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number || 0);
    };

    return (
        <div className="flex bg-gray-900 text-white min-h-screen font-sans">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
                {loading && <p>Memuat data...</p>}
                {error && <p className="text-red-400">{error}</p>}
                {!loading && !error && (
                    <>
                        <section>
                            <h2 className="text-xl font-semibold mb-4">Statistik Kilat</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard title="Kendaraan Tersedia" value={stats?.kendaraanTersedia || 0} />
                                <StatCard title="Transaksi Aktif" value={stats?.transaksiAktif || 0} />
                                <StatCard title="Total Penyewa" value={stats?.totalPenyewa || 0} />
                                <StatCard title="Pendapatan Bulan Ini" value={formatCurrency(stats?.pendapatanBulanIni)} />
                            </div>
                        </section>
                        <section className="mt-10">
                            <h2 className="text-xl font-semibold mb-4">Transaksi Terbaru</h2>
                            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="border-b border-gray-700">
                                        <tr>
                                            <th className="p-4">ID Sewa</th>
                                            <th className="p-4">Penyewa</th>
                                            <th className="p-4">Kendaraan</th>
                                            <th className="p-4">Total Biaya</th>
                                            <th className="p-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((trx) => (
                                            <tr key={trx.id_sewa} className="border-b border-gray-700 last:border-none hover:bg-gray-700/50">
                                                <td className="p-4 font-mono">{trx.id_sewa}</td>
                                                <td className="p-4">{trx.penyewa}</td>
                                                <td className="p-4">{trx.kendaraan}</td>
                                                <td className="p-4">{formatCurrency(trx.total_biaya)}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 text-sm rounded-full font-medium capitalize ${getStatusClass(trx.status)}`}>
                                                        {trx.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};

export default DashboardPage;