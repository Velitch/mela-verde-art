import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useMood } from '../context/MoodContext';
import { X, Scan, Expand, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const generateRandomStyle = (index) => {
    const rotate = (Math.random() * 6 - 3).toFixed(1);
    const marginTop = index % 2 === 0 ? '0px' : `${Math.floor(Math.random() * 80) + 20}px`;
    const marginX = `${Math.floor(Math.random() * -15)}px`;
    return { rotate: `${rotate}deg`, marginTop, marginLeft: marginX, marginRight: marginX };
};

const Gallery = () => {
    const [allPhotos, setAllPhotos] = useState([]);
    const [filteredPhotos, setFilteredPhotos] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const touchStart = useRef(null);

    // Usiamo solo getActiveColor per mantenere l'estetica coerente,
    // ma NON importiamo le funzioni di modifica (setVibe, setIsNeon)
    // per garantire che la gallery non cambi il mood di tutto il sito.
    const { getActiveColor } = useMood();
    const globalAccent = getActiveColor();

    const getSeoAlt = (photo) => {
        const typeLabel = photo.type === 'video' ? 'Video Performance' : 'Fotografia';
        const base = `Melaverde Bodypaint Milano - ${typeLabel}`;
        const vibeMap = {
            psy: "Psychedelic Glitch Art ed Estetica Acid Neon",
            natural: "Fotografia Organica, Texture e Forme Naturali",
            bdsm: "Underground Performance, Bondage Visual e Dark Aesthetic"
        };
        return `${base} ${vibeMap[photo.vibe] || 'Artistica'} - ID ${photo.id}`;
    };

    const navigateGallery = useCallback((direction) => {
        if (!selectedPhoto) return;
        const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
        let nextIndex = direction === 'next'
            ? (currentIndex + 1) % filteredPhotos.length
            : (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
        setSelectedPhoto(filteredPhotos[nextIndex]);
    }, [selectedPhoto, filteredPhotos]);

    const handleTouchStart = (e) => { touchStart.current = e.targetTouches[0].clientX; };
    const handleTouchMove = (e) => {
        if (!touchStart.current) return;
        const diff = touchStart.current - e.targetTouches[0].clientX;
        if (Math.abs(diff) > 70) {
            navigateGallery(diff > 0 ? 'next' : 'prev');
            touchStart.current = null;
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedPhoto) return;
            if (e.key === 'ArrowRight') navigateGallery('next');
            if (e.key === 'ArrowLeft') navigateGallery('prev');
            if (e.key === 'Escape') setSelectedPhoto(null);
        };
        document.body.style.overflow = selectedPhoto ? 'hidden' : 'unset';
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedPhoto, navigateGallery]);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/gallery');
                const photosWithStyle = res.data.map((p, i) => ({ ...p, randomStyle: generateRandomStyle(i) }));
                setAllPhotos(photosWithStyle);
                setFilteredPhotos(photosWithStyle);
                setLoading(false);
            } catch (err) { console.error("Gallery Error:", err); setLoading(false); }
        };
        fetchGallery();
    }, []);

    const applyFilter = (vibeId) => {
        // AGGIORNA SOLO IL FILTRO LOCALE
        setActiveFilter(vibeId);

        // FILTRA LE FOTO SENZA CHIAMARE IL MOODCONTEXT
        if (vibeId === 'all') {
            setFilteredPhotos(allPhotos);
        } else {
            setFilteredPhotos(allPhotos.filter(p => p.vibe === vibeId));
        }
    };

    // Colori specifici per i tasti della gallery (indipendenti dal resto del sito)
    const getLocalVibeColor = (vibe) => {
        const colors = { psy: '#39ff14', bdsm: '#ff0000', natural: '#FFFF00' };
        return colors[vibe] || globalAccent;
    };

    return (
        <>
            <Helmet>
                <title>Melaverde | Galleria & Opere</title>
                <meta name="description" content="Sfoglia l'archivio visuale di Melaverde: dai contrasti BDSM alle texture naturali e alle distorsioni psichedeliche." />
            </Helmet>

            <main className="relative min-h-screen bg-main text-white pt-24 pb-40 overflow-x-hidden">
                <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('/assets/noise.png')]" aria-hidden="true"></div>

                <section className="relative max-w-[1700px] mx-auto px-4 md:px-10 z-10">
                    <header className="flex flex-col gap-6 mb-20 border-b border-white/5 pb-10">
                        <div className="flex items-center gap-4">
                            <Scan size={24} className="text-white/20" />
                            <h1 className="text-4xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                                Visual<span className="text-white/20">_</span>Archive
                            </h1>
                        </div>

                        <nav className="flex flex-wrap gap-0 border border-white/10 bg-[#050505] self-start overflow-hidden">
                            {['all', 'natural', 'psy', 'bdsm'].map((id) => (
                                <button
                                    key={id}
                                    onClick={() => applyFilter(id)}
                                    aria-pressed={activeFilter === id}
                                    className={`px-5 py-4 md:px-8 md:py-5 font-black uppercase italic text-[10px] md:text-[11px] tracking-widest transition-all ${activeFilter === id ? 'text-black' : 'text-white/40 hover:text-white'}`}
                                    style={activeFilter === id ? { backgroundColor: getLocalVibeColor(id) } : {}}
                                >
                                    {id}
                                </button>
                            ))}
                        </nav>
                    </header>

                    {loading ? (
                        <div
                            className="py-20 text-center font-mono animate-pulse text-xs uppercase tracking-widest"
                            style={{ color: globalAccent }}
                        >
                            System_Scanning_Assets...
                        </div>
                    ) : (
                        <div className="flex flex-wrap justify-center -mx-2 md:-mx-4">
                            <AnimatePresence mode='popLayout'>
                                {filteredPhotos.map((photo) => (
                                    <motion.article
                                        key={photo.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="relative p-2 flex-shrink-0 cursor-pointer"
                                        style={{ width: `calc(${photo.id % 2 === 0 ? '50%' : '50%'} - 8px)`, mdWidth: '33%', ...photo.randomStyle }}
                                        onClick={() => setSelectedPhoto(photo)}
                                    >
                                        <div className="relative border border-white/5 bg-[#0a0a0a] p-1 group overflow-hidden">
                                            {photo.type === 'video' ? (
                                                <div className="relative aspect-[4/5] bg-main">
                                                    <video
                                                        src={photo.image_url}
                                                        muted
                                                        loop
                                                        playsInline
                                                        onMouseEnter={e => e.target.play()}
                                                        onMouseLeave={e => { e.target.pause(); e.target.currentTime = 0; }}
                                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                                                    />
                                                    <div className="absolute top-3 right-3 p-1.5 bg-main/60 backdrop-blur-md border border-white/10 group-hover:border-white/50 transition-colors">
                                                        <Play size={12} className="text-white" fill="currentColor" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <img
                                                    src={photo.image_url}
                                                    alt={getSeoAlt(photo)}
                                                    loading="lazy"
                                                    className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                                                />
                                            )}
                                            <Expand size={16} className="absolute bottom-3 right-3 text-white/0 group-hover:text-white/50 transition-colors" />
                                        </div>
                                    </motion.article>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </section>

                <AnimatePresence>
                    {selectedPhoto && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-x-0 bottom-0 top-[70px] z-[99999] bg-main/98 backdrop-blur-3xl flex flex-col items-center justify-center"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onClick={() => setSelectedPhoto(null)}
                        >
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 hidden md:flex justify-between px-6 pointer-events-none">
                                <button className="p-4 text-white/20 hover:text-white pointer-events-auto transition-colors" onClick={(e) => { e.stopPropagation(); navigateGallery('prev'); }}>
                                    <ChevronLeft size={64} strokeWidth={1} />
                                </button>
                                <button className="p-4 text-white/20 hover:text-white pointer-events-auto transition-colors" onClick={(e) => { e.stopPropagation(); navigateGallery('next'); }}>
                                    <ChevronRight size={64} strokeWidth={1} />
                                </button>
                            </div>

                            <button className="absolute top-6 right-6 p-4 text-white/40 hover:text-white transition-colors" onClick={() => setSelectedPhoto(null)}>
                                <X size={32} />
                            </button>

                            <motion.figure
                                key={selectedPhoto.id}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative flex flex-col items-center w-full px-4"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="relative border-2 md:border-4 shadow-[0_0_50px_rgba(0,0,0,1)]" style={{ borderColor: getLocalVibeColor(selectedPhoto.vibe) }}>
                                    {selectedPhoto.type === 'video' ? (
                                        <video
                                            src={selectedPhoto.image_url}
                                            controls
                                            autoPlay
                                            loop
                                            className="w-auto h-auto max-w-full max-h-[65vh] md:max-h-[75vh] block"
                                        />
                                    ) : (
                                        <img
                                            src={selectedPhoto.image_url}
                                            alt={getSeoAlt(selectedPhoto)}
                                            className="w-auto h-auto max-w-full max-h-[65vh] md:max-h-[75vh] object-contain block"
                                        />
                                    )}
                                </div>

                                <figcaption className="mt-8 w-full max-w-xl flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[10px] bg-main/50 p-6 border border-white/10 uppercase tracking-[0.2em]">
                                    <div className="flex gap-6">
                                        <span className="text-white/20">Ref_ID: {selectedPhoto.id}</span>
                                        <span style={{ color: getLocalVibeColor(selectedPhoto.vibe) }}>Protocol: {selectedPhoto.vibe}</span>
                                        <span className="text-white/20">Type: {selectedPhoto.type.toUpperCase()}</span>
                                    </div>
                                    <span className="text-white/10 hidden md:block italic">Swipe_To_Navigate</span>
                                </figcaption>
                            </motion.figure>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </>
    );
};

export default Gallery;