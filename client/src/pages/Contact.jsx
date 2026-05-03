import React from 'react';
import { motion } from 'framer-motion';
import { useMood } from '../context/MoodContext';
import { Camera, Mail, Scan, Globe, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Contact = () => {
    const { isNeon, vibe, getActiveColor } = useMood();

    // Utilizziamo direttamente getActiveColor dal context per coerenza
    const activeColor = getActiveColor();

    const contactLinks = [
        {
            label: 'Instagram',
            value: '@melaverde_art',
            href: 'https://www.instagram.com/melaverde_art/',
            icon: <Camera size={20} />
        },
        {
            label: 'Email',
            value: 'info@melaverde.art',
            href: 'mailto:info@melaverde.art',
            icon: <Mail size={20} />
        }
    ];

    return (
        <>
            {/* SEO DINAMICO PER I CONTATTI */}
            <Helmet>
                <title>Melaverde | Collabora & Contatti</title>
                <meta name="description" content="Prenota una sessione di bodypainting o proponi una collaborazione artistica a Melaverde. Trasforma la tua visione in realtà a Milano e Roma." />
                <meta property="og:title" content="Melaverde | Booking & Collabs" />
                <meta property="og:type" content="profile" />
            </Helmet>

            <main className="relative min-h-screen bg-main text-white pt-24 pb-20 md:pt-32 md:pb-40 overflow-x-hidden transition-colors duration-1000">
                {/* Background Texture */}
                <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-[url('/assets/noise.png')]" aria-hidden="true"></div>

                <section className="relative max-w-[1200px] mx-auto px-6 z-10">
                    {/* Header semplificato per Mobile */}
                    <header className="mb-12 md:mb-24 border-b border-white/5 pb-8 md:pb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <Scan size={18} className="text-white/20" />
                            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/40">
                                System_Contact_Access
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
                            Contatti<span style={{ color: activeColor }}>.</span>
                        </h1>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20">

                        {/* Link Contacts */}
                        <div className="space-y-6 md:space-y-10">
                            {contactLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block border border-white/10 bg-[#080808] p-6 md:p-8 transition-colors hover:border-white/30 group"
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-2 text-white/30">
                                            {link.icon}
                                            <span className="text-[10px] font-mono uppercase tracking-widest">
                                                {link.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl md:text-4xl font-black italic uppercase tracking-tight break-all">
                                                {link.value}
                                            </span>
                                            <ExternalLink
                                                size={20}
                                                style={{ color: activeColor }}
                                                className="flex-shrink-0 ml-4 group-hover:scale-110 transition-transform"
                                            />
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Info Box - Static & Solid */}
                        <div className="relative p-6 md:p-10 bg-[#050505] border border-white/5 flex flex-col justify-between h-fit lg:h-auto">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Globe size={18} style={{ color: activeColor }} />
                                    <span className="text-[11px] font-black uppercase italic tracking-widest text-zinc-200">Base: Roma_Underground</span>
                                </div>
                                <p className="text-xs md:text-sm text-zinc-400 font-mono leading-relaxed uppercase tracking-tight">
                                    Disponibile per bodypainting performance, set fotografici e sperimentazione visuale.
                                    <br /><br />
                                    Tempi di risposta stimati: 24h.
                                </p>
                            </div>

                            {/* Status Bar Semplice */}
                            <div className="mt-10 md:mt-16 pt-6 border-t border-white/5">
                                <div className="flex justify-between text-[8px] font-mono text-white/10 uppercase tracking-widest mb-3">
                                    <span>Signal_Secure</span>
                                    <span>v2.6.0</span>
                                </div>
                                <div className="h-[2px] w-full bg-white/5">
                                    <motion.div
                                        className="h-full"
                                        style={{ backgroundColor: activeColor }}
                                        animate={{ opacity: [0.2, 1, 0.2] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </main>
        </>
    );
};

export default Contact;