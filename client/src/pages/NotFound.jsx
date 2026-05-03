import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMood } from '../context/MoodContext';
import { Helmet } from 'react-helmet-async';
import { Home, RefreshCcw } from 'lucide-react';

const NotFound = () => {
    const { getActiveColor, isNeon } = useMood();
    const activeColor = getActiveColor();

    return (
        <>
            <Helmet>
                <title>Melaverde | 404 Not Found</title>
                <meta name="robots" content="noindex, follow" />
            </Helmet>

            <main className="relative min-h-screen bg-main flex flex-col items-center justify-center px-6 overflow-hidden">
                {/* Effetto Disturbo sullo sfondo */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/assets/noise.png')]" />

                <div className="relative z-10 text-center">
                    {/* Codice Errore con Glitch Animation */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[25vw] md:text-[20vw] font-black italic leading-none tracking-tighter mix-blend-difference"
                        style={{
                            color: activeColor,
                            textShadow: isNeon ? `0 0 30px ${activeColor}` : 'none'
                        }}
                    >
                        404
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 space-y-6"
                    >
                        <h2 className="text-xl md:text-3xl font-black uppercase italic tracking-widest text-white">
                            Visione_Smarrita
                        </h2>

                        <p className="max-w-md mx-auto text-sm md:text-base opacity-50 font-mono uppercase tracking-tight italic">
                            Il percorso che stai cercando non esiste in questa dimensione artistica.
                            La realtà è stata distorta o il link è obsoleto.
                        </p>

                        <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link
                                to="/"
                                className="group flex items-center gap-3 px-8 py-4 border border-white/10 hover:border-white transition-all duration-500"
                            >
                                <Home size={18} style={{ color: activeColor }} />
                                <span className="font-black uppercase italic text-xs tracking-widest text-white">
                                    Torna alla Home
                                </span>
                            </Link>

                            <button
                                onClick={() => window.location.reload()}
                                className="group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 transition-all duration-500"
                            >
                                <RefreshCcw size={18} className="text-white/40 group-hover:rotate-180 transition-transform duration-700" />
                                <span className="font-black uppercase italic text-xs tracking-widest text-white/40 group-hover:text-white">
                                    Ricarica Sistema
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Elementi Decorativi Glitch */}
                {isNeon && (
                    <div className="absolute bottom-10 left-10 flex flex-col gap-2 opacity-20 font-mono text-[8px] text-white uppercase tracking-[0.5em]">
                        <span>Error_Type: NULL_POINTER</span>
                        <span>Status: DIMENSIONAL_SHIFT</span>
                    </div>
                )}
            </main>
        </>
    );
};

export default NotFound;