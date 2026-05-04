import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

// Recuperiamo l'URL dal file .env di Vercel
const API_URL = import.meta.env.VITE_API_URL;

const AdminLogin = () => {
    // Usiamo 'username' invece di 'email' per coincidere con il database
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Resetta l'errore a ogni tentativo

        try {
            // ✅ USIAMO credentials (NON formData) e l'URL dinamico
            const res = await axios.post(`${API_URL}/auth/login`, credentials);

            if (res.data.token) {
                localStorage.setItem('adminToken', res.data.token);
                localStorage.setItem('adminUser', res.data.username || 'admin');

                // Reindirizziamo alla dashboard
                window.location.href = '/admin/dashboard';
            }
        } catch (err) {
            console.error("FULL ERROR:", err);
            // Mostriamo il messaggio specifico dal server o un errore generico
            setError(err.response?.data?.message || "Credenziali errate o errore di sistema");
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl"
            >
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-[#39ff14]">
                        MV_ADMIN
                    </h1>
                    <p className="text-white/40 text-sm mt-2 uppercase tracking-widest">Accesso Riservato</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* USERNAME */}
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                        <input
                            type="text"
                            placeholder="Username"
                            required
                            className="w-full bg-black/50 border border-white/10 p-4 pl-12 rounded-xl focus:border-[#39ff14] outline-none transition-all text-white"
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            className="w-full bg-black/50 border border-white/10 p-4 pl-12 pr-12 rounded-xl focus:border-[#39ff14] outline-none transition-all text-white"
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-sm font-bold text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#39ff14] text-black font-black py-4 rounded-xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all mt-4"
                    >
                        Entra nel Sistema
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;