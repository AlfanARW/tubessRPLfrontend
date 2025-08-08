import React from 'react';
// Anda bisa mengimpor ikon dari library seperti 'react-icons'
// npm install react-icons
import { FiGrid, FiRepeat, FiDatabase, FiFileText, FiLogOut, FiUser } from 'react-icons/fi';

const Sidebar = () => {
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        window.location.href = '/';
    };

    const navItems = [
        { icon: <FiGrid />, name: 'Dashboard' },
        { icon: <FiRepeat />, name: 'Manajemen Transaksi' },
        { icon: <FiDatabase />, name: 'Manajemen Data Master' },
        { icon: <FiFileText />, name: 'Pelaporan' },
    ];

    return (
        <aside className="w-64 bg-gray-800 text-white flex flex-col h-screen">
            {/* User Profile Section */}
            <div className="p-6 text-center border-b border-gray-700">
                <FiUser className="w-16 h-16 mx-auto bg-gray-700 p-3 rounded-full" />
                <h3 className="mt-3 font-semibold">M. Arasy</h3>
                <p className="text-sm text-gray-400">Petugas</p>
            </div>

            {/* Navigation Section */}
            <nav className="flex-grow p-4">
                <ul className="space-y-2">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <a href="#" className={`flex items-center p-3 rounded-lg transition-colors ${index === 0 ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                                <span className="mr-3 text-lg">{item.icon}</span>
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout Section */}
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