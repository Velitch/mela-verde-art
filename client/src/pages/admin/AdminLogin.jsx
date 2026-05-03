import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Verifica che l'URL corrisponda alla porta del server
            const res = await axios.post(`http://localhost:3001/api/auth/login`, credentials);            // Salviamo il token
            localStorage.setItem('adminToken', res.data.token);
            localStorage.setItem('adminUser', res.data.username);

            // Reindirizziamo alla dashboard
            window.location.href = '/admin/dashboard';
        } catch (err) {
            console.error("FULL ERROR:", err); // Guarda questo nella console del browser (F12)
            setError(err.message);
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
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-psy-green">
                        MV_ADMIN
                    </h1>
                    <p className="text-white/40 text-sm mt-2 uppercase tracking-widest">Accesso Riservato</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* EMAIL */}
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            className="w-full bg-main/50 border border-white/10 p-4 pl-12 rounded-xl focus:border-psy-green outline-none transition-all text-white"
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            className="w-full bg-main/50 border border-white/10 p-4 pl-12 pr-12 rounded-xl focus:border-psy-green outline-none transition-all text-white"
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

                    {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-psy-green text-black font-black py-4 rounded-xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all mt-4"
                    >
                        Entra nel Sistema
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;