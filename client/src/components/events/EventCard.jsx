import React, { useEffect, useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import { ArrowUpRight, MapPin, Calendar, Zap, Leaf, Skull } from 'lucide-react';
import axios from 'axios';
import '../../styles/EventThemes.css';

// ✅ RECUPERO URL DINAMICO
const API_URL = import.meta.env.VITE_API_URL;

const EventCard = ({ event, onVisible, timeStatus }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-45% 0px -45% 0px" });

    useEffect(() => {
        if (isInView && onVisible && event?.vibe) {
            onVisible(event.vibe);
        }
    }, [isInView, event?.vibe, onVisible]);

    if (!event) return null;

    const isPsy = event.vibe === 'psy';
    const isNat = event.vibe === 'natural';
    const isBdsm = event.vibe === 'bdsm';
    const isPast = timeStatus === 'past';

    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        return new Date(dateStr).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' });
    };

    const startDate = formatDate(event.date);
    const endDate = formatDate(event.endDate);

    const handleTrackClick = async () => {
        try {
            // ✅ CORRETTO: Invia il ping al server Render
            await axios.post(`${API_URL}/events/${event.id}/view`);
        } catch (err) {
            console.warn("Analytics ping failed");
        }
    };

    const getThemeClass = () => {
        if (isPsy) return 'card-psy';
        if (isNat) return 'card-nat';
        if (isBdsm) return 'card-bdsm';
        return '';
    };

    const getOverlayClass = () => {
        if (isPsy) return 'overlay-psy';
        if (isNat) return 'overlay-natural';
        if (isBdsm) return 'overlay-bdsm';
        return '';
    };

    return (
        <motion.a
            ref={ref}
            href={event.external_link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleTrackClick}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`event-card-main ${getThemeClass()} ${isPast ? 'event-past' : ''}`}
        >
            <div className="card-img-container relative overflow-hidden">
                <img
                    src={event.image_url}
                    alt={event.name}
                    className={isPast ? 'grayscale' : ''}
                />

                <div className={`vibe-image-tag ${isPsy ? 'bg-green-500' : isBdsm ? 'bg-red-600' : 'bg-[#FFFF00]'}`}>
                    {isPsy && <Zap size={10} fill="currentColor" />}
                    {isNat && <Leaf size={10} fill="currentColor" />}
                    {isBdsm && <Skull size={10} fill="currentColor" />}
                    <span>{event.vibe}</span>
                </div>

                <div className={`img-overlay ${getOverlayClass()}`} />
            </div>

            <div className="card-content-right">
                <div className="card-text-content">
                    <div className="card-header-meta">
                        <span className="vibe-label">{event.organizer || 'Melaverde'}</span>
                        <span className="year-label">{new Date(event.date).getFullYear()}</span>
                    </div>

                    <h3 className="event-title">{event.name}</h3>

                    <div className="event-description line-clamp-3">
                        {event.description}
                    </div>
                </div>

                <div className="card-footer-meta">
                    <div className="meta-item">
                        <MapPin size={14} className="text-accent shrink-0" />
                        <span className="meta-text">{event.location}</span>
                    </div>

                    <div className="meta-item">
                        <Calendar size={14} className="text-accent shrink-0" />
                        <span className="meta-text text-white uppercase font-bold tracking-tight">
                            {startDate}
                            {endDate && endDate !== startDate && (
                                <span className="mx-1 text-white"> — {endDate}</span>
                            )}
                        </span>
                    </div>
                </div>
            </div>

            <div className="hover-indicator">
                <ArrowUpRight size={24} />
            </div>
        </motion.a>
    );
};

export default EventCard;