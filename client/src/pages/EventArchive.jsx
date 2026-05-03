import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Zap, Leaf, Skull, ExternalLink } from 'lucide-react';
import { useMood } from '../context/MoodContext';
import { Helmet } from 'react-helmet-async';

const EventArchive = () => {
    const [archivedEvents, setArchivedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isNeon, getActiveColor } = useMood();

    const activeColor = getActiveColor();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/events`)
            .then(res => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const past = res.data
                    .filter(event => new Date(event.date) < today)
                    .sort((a, b) => new Date(b.date) - new Date(a.date));

                setArchivedEvents(past);
                setLoading(false);
            })
            .catch(err => {
                console.error("Errore archivio:", err);
                setLoading(false);
            });
    }, []);

    const getVibeColor = (vibe) => {
        if (vibe === 'psy') return '#39ff14';
        if (vibe === 'bdsm') return '#ff0000';
        return '#FFFF00';
    };

    return (
        <>
            {/* SEO DINAMICO PER L'ARCHIVIO */}
            <Helmet>
                <title>Melaverde | Archivio Performance Passate</title>
                <meta name="description" content="Uno sguardo alle collaborazioni e alle esposizioni passate di Melaverde. Storia di un percorso artistico attraverso il corpo e il colore." />
                <meta property="og:title" content="Melaverde | History Archive" />
                <meta property="og:type" content="article" />
            </Helmet>

            <div className="relative min-h-screen bg-main text-white pt-32 pb-40 px-4 md:px-10 lg:px-20 transition-colors duration-1000">
                <div className="max-w-7xl mx-auto">

                    {/* BACK BUTTON */}
                    <Link
                        to="/events"
                        className="inline-flex items-center gap-2 mb-12 transition-colors group"
                        style={{ color: activeColor }}
                    >
                        <ArrowLeft size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Torna al Presente</span>
                    </Link>

                    <header className="mb-24">
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-6xl md:text-9xl font-black italic uppercase leading-none tracking-tighter"
                        >
                            Archive
                        </motion.h1>
                        <div className="h-[2px] w-full bg-white/5 mt-6 flex">
                            <div className="h-full w-1/4 transition-colors duration-1000" style={{ backgroundColor: activeColor }} />
                        </div>
                    </header>

                    {loading ? (
                        <div
                            className="animate-pulse font-black uppercase italic tracking-widest text-sm"
                            style={{ color: activeColor }}
                        >
                            Accessing_History_Data...
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {archivedEvents.map((event, index) => {
                                const vibeColor = getVibeColor(event.vibe);

                                return (
                                    <motion.a
                                        key={event.id}
                                        href={event.external_link || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        className="w-full bg-[#0A0A0A] border border-white/5 overflow-hidden transition-all hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-0.5 block decoration-none group"
                                        style={{ borderLeft: `4px solid ${vibeColor}` }}
                                    >
                                        <div className="flex flex-col md:flex-row items-stretch md:items-center p-4 md:p-6 gap-6">

                                            {/* COLONNA DATA */}
                                            <div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center md:w-28 flex-shrink-0 md:border-r border-white/10 md:pr-4">
                                                <span className="text-xl md:text-2xl font-black italic" style={{ color: vibeColor }}>
                                                    {new Date(event.date).getFullYear()}
                                                </span>
                                                <span className="text-[10px] font-bold uppercase opacity-30 tracking-widest">
                                                    {new Date(event.date).toLocaleDateString('it-IT', { month: 'short', day: '2-digit' })}
                                                </span>
                                            </div>

                                            {/* INFO PRINCIPALI */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3">
                                                    <h2 className="text-xl md:text-3xl font-black uppercase italic text-white truncate group-hover:text-white transition-colors">
                                                        {event.name}
                                                    </h2>
                                                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-40 transition-opacity text-white" />
                                                </div>
                                                <div className="flex items-center gap-6 mt-2">
                                                    <div className="flex items-center gap-2 text-white/30 whitespace-nowrap">
                                                        <MapPin size={10} style={{ color: vibeColor }} />
                                                        <span className="text-[9px] font-bold uppercase tracking-widest">{event.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-white/30 whitespace-nowrap">
                                                        {event.vibe === 'psy' && <Zap size={10} className="text-[#39ff14]" />}
                                                        {event.vibe === 'bdsm' && <Skull size={10} className="text-[#ff0000]" />}
                                                        {event.vibe === 'natural' && <Leaf size={10} className="text-[#FFFF00]" />}
                                                        <span className="text-[9px] font-bold uppercase tracking-widest">{event.vibe}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ARTWORK PREVIEW */}
                                            <div className="w-full md:w-40 h-24 md:h-16 flex-shrink-0 border border-white/10 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                                <img
                                                    src={event.image_url}
                                                    alt={`Melaverde performance - ${event.name}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        </div>
                                    </motion.a>
                                );
                            })}

                            {archivedEvents.length === 0 && (
                                <div className="py-20 text-center border border-dashed border-white/5 opacity-20 uppercase font-black italic tracking-widest text-[10px]">
                                    Archive_Empty // History_In_Progress
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default EventArchive;