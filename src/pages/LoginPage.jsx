import React, { useState } from 'react';
import axios from 'axios';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Gunakan alamat lengkap dari .env
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
                email,
                password,
            });
            localStorage.setItem('authToken', response.data.token);
            window.location.href = '/dashboard';
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError('Login gagal. Periksa koneksi Anda.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200 font-sans">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">Selamat Datang</h2>
                    <p className="text-gray-400">Masuk ke akun petugas Anda</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="contoh@rental.com"
                            required
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {error && (
                        <div className="px-4 py-3 text-sm text-red-200 bg-red-900/30 border border-red-500/50 rounded-lg">
                            {error}
                        </div>
                    )}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
                        >
                            {loading ? 'Memproses...' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;