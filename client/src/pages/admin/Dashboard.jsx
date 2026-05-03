import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    PlusCircle,
    BarChart3,
    LogOut,
    Menu,
    X,
    User as UserIcon,
    Activity,
    Image as ImageIcon // Aggiunta icona per la Gallery
} from 'lucide-react';
import EventForm from '../../components/admin/EventForm';
import EventList from '../../components/admin/EventList';
import StatsView from '../../components/admin/StatsView';
import GalleryAdmin from '../../components/admin/GalleryAdmin'; // Importato il componente GalleryAdmin
import '../../styles/Dashboard.css';

const Dashboard = () => {

    useEffect(() => {
                document.title = "Melaverde | Dashboard";
            }, []);

    const [activeTab, setActiveTab] = useState('upload');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin';
    };

    // MENU AGGIORNATO CON LA GALLERY
    const menuItems = [
        { id: 'stats', label: 'Statistiche', icon: <BarChart3 size={18} /> },
        { id: 'upload', label: 'Nuovo Evento', icon: <PlusCircle size={18} /> },
        { id: 'list', label: 'Gestione Eventi', icon: <LayoutDashboard size={18} /> },
        { id: 'gallery', label: 'Visual Archive', icon: <ImageIcon size={18} /> }, // Nuova Tab
    ];

    const adminName = localStorage.getItem('adminUser') || 'Admin';

    return (
        <div className="dashboard-wrapper min-h-screen bg-main text-white flex">

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-main/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-[#0A0A0A] border-r border-white/5 transform transition-all duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static
            `}>
                <div className="p-8 mb-10">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#FFFF00] rounded-full animate-pulse"></div>
                        <h1 className="text-[#FFFF00] font-black italic text-2xl tracking-tighter uppercase">MV_Dash</h1>
                    </div>
                    <p className="text-white/30 text-[9px] uppercase tracking-[0.3em] mt-2 font-bold text-nowrap">Artist Control Panel</p>
                </div>

                <nav className="px-4 flex flex-col h-[calc(100%-160px)]">
                    <div className="flex flex-col gap-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                                className={`
                                    flex items-center gap-4 px-5 py-4 rounded-none border-l-2 transition-all duration-200
                                    ${activeTab === item.id
                                        ? 'bg-white/5 border-[#FFFF00] text-[#FFFF00]'
                                        : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'}
                                `}
                            >
                                {item.icon}
                                <span className="font-black uppercase italic text-[11px] tracking-widest">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto pb-8 flex flex-col gap-4">
                        <div className="px-5 py-4 bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                                <UserIcon size={16} className="text-[#FFFF00]" />
                                <div className="truncate">
                                    <p className="text-[9px] text-white/40 uppercase font-bold tracking-tighter">User</p>
                                    <p className="text-xs font-black italic uppercase text-white truncate">{adminName}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-500/10 transition-all group"
                        >
                            <LogOut size={18} />
                            <span className="font-black uppercase italic text-[11px] tracking-widest">Logout</span>
                        </button>
                    </div>
                </nav>
            </aside>

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

                <header className="flex items-center justify-between p-6 lg:px-12 border-b border-white/5 bg-main/50 backdrop-blur-md z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 text-[#FFFF00]"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-6 ml-auto">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                            <Activity size={10} className="text-green-500" />
                            <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">System Active</span>
                        </div>
                        <div className="text-right">
                            <p className="text-white/20 text-[9px] font-mono uppercase tracking-tighter leading-none">Local Time</p>
                            <p className="text-white font-mono text-xs uppercase leading-none mt-1">
                                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                </header>

                <section className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar">
                    <div className="max-w-5xl mx-auto">

                        <div className="mb-12 border-b border-white/5 pb-8">
                            <div className="flex items-center gap-4">
                                <h2 className="text-4xl lg:text-5xl font-black uppercase italic leading-none tracking-tighter">
                                    {menuItems.find(i => i.id === activeTab)?.label}
                                </h2>
                                <div className="h-[2px] flex-1 bg-gradient-to-r from-[#FFFF00] to-transparent opacity-30"></div>
                            </div>
                        </div>

                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {activeTab === 'upload' && <EventForm />}
                            {activeTab === 'stats' && <StatsView />}
                            {activeTab === 'list' && <EventList />}

                            {/* RENDER COMPONENTE GALLERY */}
                            {activeTab === 'gallery' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <GalleryAdmin />
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;