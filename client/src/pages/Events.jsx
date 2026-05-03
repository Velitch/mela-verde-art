import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useMood } from '../context/MoodContext';
import EventCard from '../components/events/EventCard';
import { Helmet } from 'react-helmet-async'; // <--- Importato correttamente

const Events = () => {
    const [futureEvents, setFutureEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isNeon, setIsNeon, getActiveColor } = useMood();

    const activeColor = getActiveColor();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/events`)
            .then(res => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const future = [];
                const past = [];

                res.data.forEach(event => {
                    const eventDate = new Date(event.date);
                    eventDate.setHours(0, 0, 0, 0);

                    let timeStatus = eventDate.getTime() === today.getTime()
                        ? 'live'
                        : (eventDate < today ? 'past' : 'future');

                    const enrichedEvent = { ...event, timeStatus };
                    if (timeStatus === 'past') past.push(enrichedEvent);
                    else future.push(enrichedEvent);
                });

                future.sort((a, b) => new Date(a.date) - new Date(b.date));
                past.sort((a, b) => new Date(b.date) - new Date(a.date));

                setFutureEvents(future);
                setPastEvents(past);
                setLoading(false);
            })
            .catch(err => {
                console.error("Errore:", err);
                setLoading(false);
            });
    }, []);

    const handleMoodChange = (vibe) => {
        if (vibe === 'psy' && !isNeon) setIsNeon(true);
        if (vibe === 'natural' && isNeon) setIsNeon(false);
    };

    const displayedPastEvents = pastEvents.slice(0, 5);
    const hasMorePastEvents = pastEvents.length > 5;

    return (
        <>
            {/* SEO DINAMICA CON HELMET */}
            <Helmet>
                <title>
                    {futureEvents.length > 0
                        ? `Melaverde | ${futureEvents.length} Eventi in Programma`
                        : "Melaverde | Performance & Eventi Live"}
                </title>
                <meta name="description" content="Partecipa alle performance live di Melaverde a Milano. Scopri le date dei prossimi eventi di bodypainting, workshop e mostre d'arte." />
                <meta property="og:title" content="Melaverde Eventi Live" />
                <meta property="og:type" content="website" />
            </Helmet>

            <div className="relative min-h-screen bg-main transition-colors duration-1000">

                <div className="pt-32 pb-40 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto">

                    <header className="mb-24 text-center md:text-left">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-7xl md:text-9xl font-black italic uppercase mix-blend-difference tracking-tighter text-white"
                        >
                            Eventi
                        </motion.h1>
                        <div
                            className="h-1 w-24 mx-auto md:mx-0 mt-6 transition-all duration-700"
                            style={{
                                backgroundColor: activeColor,
                                boxShadow: isNeon ? `0 0 20px ${activeColor}` : 'none'
                            }}
                        />
                    </header>

                    <div className="flex flex-col gap-32">
                        {loading ? (
                            <div
                                className="animate-pulse font-black uppercase italic tracking-widest text-center py-20"
                                style={{ color: activeColor }}
                            >
                                Loading_Vibes...
                            </div>
                        ) : (
                            <>
                                {/* SEZIONE FUTURI / LIVE */}
                                <section className="flex flex-col gap-24">
                                    {futureEvents.length > 0 ? (
                                        futureEvents.map(event => (
                                            <EventCard
                                                key={event.id}
                                                event={event}
                                                onVisible={handleMoodChange}
                                                timeStatus={event.timeStatus}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-white/20 uppercase font-black italic tracking-widest text-center">
                                            Nessun evento in programma. Stay tuned.
                                        </p>
                                    )}
                                </section>

                                {/* SEZIONE RECENTI */}
                                {pastEvents.length > 0 && (
                                    <section className="mt-20">
                                        <div className="flex items-center gap-4 mb-16 opacity-30">
                                            <div className="h-[1px] flex-1 bg-white" />
                                            <span className="text-xs font-black uppercase tracking-[0.4em] whitespace-nowrap text-white">
                                                Recenti
                                            </span>
                                            <div className="h-[1px] flex-1 bg-white" />
                                        </div>

                                        <div className="flex flex-col gap-24">
                                            {displayedPastEvents.map(event => (
                                                <EventCard
                                                    key={event.id}
                                                    event={event}
                                                    onVisible={handleMoodChange}
                                                    timeStatus={event.timeStatus}
                                                />
                                            ))}
                                        </div>

                                        {/* LINK ALL'ARCHIVIO COMPLETO */}
                                        {hasMorePastEvents && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                className="pt-24 flex justify-center"
                                            >
                                                <Link
                                                    to="/archivio-eventi"
                                                    className="group relative flex flex-col items-center gap-4"
                                                >
                                                    <div
                                                        className="flex items-center gap-4 font-black uppercase italic tracking-widest text-2xl group-hover:gap-8 transition-all duration-500"
                                                        style={{ color: activeColor }}
                                                    >
                                                        <span>Vedi Archivio Completo</span>
                                                        <ArrowRight size={32} />
                                                    </div>
                                                    <div
                                                        className="h-[1px] w-0 transition-all duration-500 group-hover:w-full"
                                                        style={{ backgroundColor: activeColor }}
                                                    />
                                                </Link>
                                            </motion.div>
                                        )}
                                    </section>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Events;