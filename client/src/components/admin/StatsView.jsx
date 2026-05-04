import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, Calendar, Eye } from 'lucide-react';

// ✅ RECUPERO URL DINAMICO
const API_URL = import.meta.env.VITE_API_URL;

const StatsView = () => {
    const [stats, setStats] = useState({ totalEvents: 0, totalViews: 0, upcomingEvents: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                // ✅ Endpoint corretto e gestione errori
                const res = await axios.get(`${API_URL}/events/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (err) {
                console.error("Errore recupero statistiche:", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Eventi Totali" value={stats.totalEvents} icon={<Calendar />} color="#FFFF00" />
                <StatCard title="Visualizzazioni Eventi Totali" value={stats.totalViews} icon={<Eye />} color="#FFFFFF" />
                <StatCard title="Show in Arrivo" value={stats.upcomingEvents} icon={<TrendingUp />} color="#FFFF00" />
            </div>

            <div className="bg-white/5 border border-white/5 p-8">
                <h3 className="text-[#FFFF00] font-black uppercase italic mb-6">Performance_System</h3>
                <p className="text-white/30 text-xs tracking-wider uppercase leading-relaxed">
                    Il tracciamento delle visualizzazioni è attivo. I dati vengono aggiornati in tempo reale ogni volta che un utente visualizza un evento sul sito pubblico.
                </p>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className="p-8 bg-[#0A0A0A] border border-white/5 relative group hover:border-white/20 transition-all">
        <div className="text-white/10 absolute top-6 right-6 group-hover:text-[#FFFF00]/20 transition-colors">
            {React.cloneElement(icon, { size: 32 })}
        </div>
        <p className="text-white/40 uppercase text-[9px] font-black tracking-[0.2em] mb-4">{title}</p>
        <p className="text-5xl font-black italic tracking-tighter" style={{ color: color }}>{value}</p>
    </div>
);

export default StatsView;