import React from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';

const DashboardPage = () => {
    // Data dummy untuk statistik dan tabel
    const stats = [
        { title: 'Kendaraan Tersedia', value: '12' },
        { title: 'Transaksi Aktif', value: '8' },
        { title: 'Total Penyewa', value: '75' },
        { title: 'Pendapatan Bulan Ini', value: 'Rp 5.250.000,00' },
    ];

    const transactions = [
        { id: 'S0151', penyewa: 'Budi Santoso', kendaraan: 'Avanza G. 15', biaya: 'Rp 600.000,00', status: 'Disewa' },
        { id: 'S0145', penyewa: 'Ani Lestari', kendaraan: 'Xenia R', biaya: 'Rp 500.000,00', status: 'Selesai' },
        { id: 'S0125', penyewa: 'Yuda Suharto Wibowo', kendaraan: 'Ertiga GL', biaya: 'Rp 1.000.000,00', status: 'Disewa' },
        { id: 'S0169', penyewa: 'Alifa Raudhatul Nisa', kendaraan: 'Brio Satya E', biaya: 'Rp 5.000.000,00', status: 'Disewa' },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'Disewa':
                return 'bg-yellow-500/20 text-yellow-300';
            case 'Selesai':
                return 'bg-green-500/20 text-green-300';
            default:
                return 'bg-gray-500/20 text-gray-300';
        }
    };

    return (
        <div className="flex bg-gray-900 text-white min-h-screen font-sans">
            <Sidebar />

            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

                {/* Statistik Kilat */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Statistik Kilat</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <StatCard key={index} title={stat.title} value={stat.value} />
                        ))}
                    </div>
                </section>

                {/* Transaksi Terbaru */}
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
                                {transactions.map((trx, index) => (
                                    <tr key={index} className="border-b border-gray-700 last:border-none hover:bg-gray-700/50">
                                        <td className="p-4">{trx.id}</td>
                                        <td className="p-4">{trx.penyewa}</td>
                                        <td className="p-4">{trx.kendaraan}</td>
                                        <td className="p-4">{trx.biaya}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusClass(trx.status)}`}>
                                                {trx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DashboardPage;