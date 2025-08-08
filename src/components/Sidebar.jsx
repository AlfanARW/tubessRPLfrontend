import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    FiGrid, 
    FiRepeat, 
    FiDatabase, 
    FiFileText, 
    FiLogOut, 
    FiUser, 
    FiChevronDown, 
    FiUsers, 
    FiTruck, 
    FiUserCheck 
} from 'react-icons/fi';

const Sidebar = () => {
    // State untuk mengontrol apakah menu popup terbuka atau tertutup
    const [isMasterDataOpen, setIsMasterDataOpen] = useState(false);

    // Fungsi untuk logout
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        window.location.href = '/';
    };

    return (
        <aside className="w-64 bg-gray-800 text-white flex flex-col h-screen">
            {/* Bagian Profil Pengguna */}
            <div className="p-6 text-center border-b border-gray-700">
                <FiUser className="w-16 h-16 mx-auto bg-gray-700 p-3 rounded-full" />
                <h3 className="mt-3 font-semibold">M. Arasy</h3>
                <p className="text-sm text-gray-400">Petugas</p>
            </div>

            {/* Bagian Navigasi */}
            <nav className="flex-grow p-4">
                <ul className="space-y-2">
                    <li>
                        <Link to="/dashboard" className="flex items-center p-3 rounded-lg transition-colors hover:bg-gray-700">
                            <FiGrid className="mr-3 text-lg" /> Dashboard
                        </Link>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-3 rounded-lg transition-colors hover:bg-gray-700">
                            <FiRepeat className="mr-3 text-lg" /> Manajemen Transaksi
                        </a>
                    </li>
                    
                    {/* Tombol Manajemen Data Master dengan Popup */}
                    <li className="relative">
                        <button onClick={() => setIsMasterDataOpen(!isMasterDataOpen)} className="w-full flex justify-between items-center p-3 rounded-lg transition-colors hover:bg-gray-700">
                            <span className="flex items-center"><FiDatabase className="mr-3 text-lg" /> Manajemen Data Master</span>
                            <FiChevronDown className={`transition-transform ${isMasterDataOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {/* Menu Popup */}
                        {isMasterDataOpen && (
                            <ul className="pl-8 mt-1 space-y-1">
                                <li>
                                    <Link to="/manajemen-penyewa" className="flex items-center p-2 rounded-lg hover:bg-gray-700 text-sm">
                                        <FiUsers className="mr-2" /> Data Penyewa
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/manajemen-kendaraan" className="flex items-center p-2 rounded-lg hover:bg-gray-700 text-sm">
                                        <FiTruck className="mr-2" /> Data Kendaraan
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/manajemen-petugas" className="flex items-center p-2 rounded-lg hover:bg-gray-700 text-sm">
                                        <FiUserCheck className="mr-2" /> Data Petugas
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li>
                        <a href="#" className="flex items-center p-3 rounded-lg transition-colors hover:bg-gray-700">
                            <FiFileText className="mr-3 text-lg" /> Pelaporan
                        </a>
                    </li>
                </ul>
            </nav>

            {/* Bagian Logout */}
            <div className="p-4 border-t border-gray-700">
                <button onClick={handleLogout} className="flex items-center w-full p-3 rounded-lg transition-colors hover:bg-gray-700">
                    <FiLogOut className="mr-3 text-lg" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;