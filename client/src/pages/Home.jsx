import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useMood } from '../context/MoodContext';
import { ArrowUpRight, MapPin, Calendar, Palette, Eye, ImageIcon } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    const { isNeon, vibe, getActiveColor } = useMood();
    const [nextEvent, setNextEvent] = useState(null);
    const [galleryPreview, setGalleryPreview] = useState([]);
    const [loading, setLoading] = useState(true);

    const activeColor = getActiveColor();

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [eventRes, galleryRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/events`),
                    axios.get(`${import.meta.env.VITE_API_URL}/gallery`)
                ]);

                const today = new Date().setHours(0, 0, 0, 0);
                const future = eventRes.data
                    .filter(event => new Date(event.date).setHours(0, 0, 0, 0) >= today)
                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                if (future.length > 0) setNextEvent(future[0]);
                setGalleryPreview(galleryRes.data.slice(0, 8));
                setLoading(false);
            } catch (err) {
                console.error("Errore fetch home data:", err);
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    return (
        <>
            <Helmet>
                <title>Melaverde | Bodypainting & Visual Art Roma</title>
                <meta name="description" content="Esplora l'arte di Melaverde a Roma. Bodypainting, performance visive e metamorfosi del corpo tra estetica naturale e visioni neon." />
                <meta property="og:title" content="Melaverde | Bodypainting Art" />
                <meta property="og:description" content="La pelle come tela, l'arte come metamorfosi." />
                <meta property="og:type" content="website" />
            </Helmet>

            <main className="bg-main text-white overflow-x-hidden">

                {/* --- HERO SECTION --- */}
                <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-4">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute inset-0 bg-[url('/assets/gallery/psy_1777769517182.webp')] mix-blend-overlay"></div>
                    </div>

                    <div className="relative z-10 text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
                            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-zinc-400 mb-4 block italic">
                                Bodypainting & Visual Art
                            </span>
                            <h1 className="text-[14vw] md:text-[15vw] font-black italic tracking-tighter leading-none uppercase whitespace-nowrap">
                                Mela<span style={{ color: activeColor }} className="transition-colors duration-1000">verde</span>
                            </h1>
                        </motion.div>
                    </div>
                </section>

                {/* --- PROSSIMA PERFORMANCE --- */}
                <section className="py-24 px-6 bg-zinc-950 border-y border-white/5">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 mb-12">
                            <Palette size={20} style={{ color: activeColor }} className="transition-colors duration-1000" />
                            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-white">Prossima Performance</h2>
                        </div>

                        {!nextEvent && !loading ? (
                            <div className="py-12 border border-dashed border-white/20 text-center italic text-zinc-400 uppercase text-[10px] tracking-widest">
                                Nuove visioni in fase di elaborazione
                            </div>
                        ) : (
                            <a
                                href={nextEvent?.external_link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex flex-col md:flex-row bg-main border border-white/10 hover:border-white/30 transition-all duration-700 overflow-hidden"
                            >
                                <div className="w-full md:w-2/5 aspect-square relative overflow-hidden">
                                    <img
                                        src={nextEvent?.image_url}
                                            /* MODIFICA: md:grayscale forza il bianco e nero solo su PC. Su mobile è colorata. */
                                            className="w-full h-full object-cover grayscale-0 md:grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                                        alt={nextEvent?.name}
                                    />
                                </div>

                                <div className="flex-1 p-8 md:p-12 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-3xl md:text-5xl font-black italic uppercase leading-tight mb-6">
                                            {nextEvent?.name}
                                        </h3>
                                        <p className="text-sm md:text-base text-zinc-200 leading-relaxed italic mb-8">
                                            "{nextEvent?.description}"
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-8 pt-6 border-t border-white/10">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} style={{ color: activeColor }} />
                                            <span className="text-[12px] font-bold uppercase tracking-wider text-zinc-300">{nextEvent?.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} style={{ color: activeColor }} />
                                            <span className="text-[12px] font-bold uppercase tracking-wider text-zinc-300">
                                                {nextEvent && new Date(nextEvent.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        )}
                    </div>
                </section>

                {/* --- MANIFESTO ARTISTICO --- */}
                <section className="py-32 px-6 max-w-[1200px] mx-auto border-t border-white/10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black italic uppercase leading-[0.9] tracking-tighter">
                                La pelle come <span style={{ color: activeColor }} className="transition-colors duration-1000">tela</span>, <br />
                                l'arte come <span className="text-zinc-500 italic">metamorfosi</span>.
                            </h2>
                        </div>
                        <p className="text-base md:text-lg text-zinc-200 leading-relaxed font-light italic">
                            Melaverde è un'esplorazione continua della forma umana. A Milano, trasformo i corpi in visioni effimere, dove il bodypainting diventa il mezzo per superare l'identità quotidiana ed entrare in una dimensione puramente estetica.
                        </p>
                    </div>
                </section>

                {/* --- FINAL CTA & GALLERY PREVIEW --- */}
                <section className="py-40 px-6 text-center bg-zinc-950">
                    <h2 className="text-5xl md:text-[8vw] font-black italic uppercase tracking-tighter leading-none mb-12">
                        Entra nella <span className="text-zinc-500 italic">Visione</span>
                    </h2>

                    <section className="py-24 px-6">
                        <div className="max-w-[1400px] mx-auto">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                                {galleryPreview.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="aspect-square bg-zinc-900 border border-white/10 overflow-hidden group relative"
                                    >
                                        <img
                                            src={item.image_url}
                                            /* MODIFICA: md:grayscale qui permette di vedere i colori su mobile senza hover */
                                            className="w-full h-full object-cover grayscale-0 md:grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                            alt="Melaverde visual preview"
                                        />
                                        <div className="absolute inset-0 bg-main/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <ImageIcon size={20} className="text-white" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <Link
                        to="/gallery"
                        className="inline-block border border-zinc-500 px-12 py-6 font-bold italic uppercase tracking-[0.3em] text-[11px] transition-all duration-700 hover:border-white hover:bg-white hover:text-black"
                        style={{ color: activeColor }}
                    >
                        Sfoglia l'Archivio
                    </Link>
                </section>
            </main>
        </>
    );
};

export default Home;