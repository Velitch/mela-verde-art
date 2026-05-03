import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMood } from '../../context/MoodContext';
import { Menu, X as CloseIcon } from 'lucide-react';

const Navbar = () => {
    const { getActiveColor, isNeon, vibe } = useMood();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const activeColor = getActiveColor();
    const isLightMode = vibe === 'natural' && !isNeon;

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Eventi', path: '/events' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Archivio', path: '/archivio-eventi' },
        { name: 'Contatti', path: '/contatti' },
    ];

    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 9999,
            backgroundColor: isLightMode ? 'rgba(244, 241, 234, 0.95)' : 'rgba(5, 10, 21, 0.95)',
            backdropFilter: 'blur(15px)',
            // ABBIAMO TOLTO TUTTO: NIENTE BORDI, NIENTE STRISCE
            border: 'none',
            padding: '15px 20px',
            transition: 'background-color 0.8s ease'
        }}>
            <div className="max-w-[1400px] mx-auto flex justify-between items-center">
                <Link to="/" style={{ textDecoration: 'none' }} className="z-[10000]">
                    <span style={{
                        fontSize: '20px', fontWeight: 900, fontStyle: 'italic',
                        textTransform: 'uppercase', letterSpacing: '-1px',
                        color: 'var(--text-main)', transition: 'color 0.8s'
                    }}>
                        Mela<span style={{ color: activeColor }}>verde</span>
                    </span>
                </Link>

                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden z-[10000] p-2" style={{ color: activeColor }}>
                    {isOpen ? <CloseIcon size={28} /> : <Menu size={28} />}
                </button>

                <div className={`
                    fixed md:relative top-0 left-0 w-full h-screen md:h-auto
                    bg-main md:bg-transparent flex flex-col md:flex-row items-center justify-center md:justify-end
                    gap-10 md:gap-8 transition-all duration-500
                    ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            style={{
                                fontSize: isOpen ? '24px' : '10px',
                                fontWeight: 900, textTransform: 'uppercase',
                                letterSpacing: '3px', fontStyle: 'italic',
                                textDecoration: 'none', transition: 'all 0.5s',
                                color: location.pathname === link.path ? activeColor : 'var(--text-main)',
                                opacity: location.pathname === link.path ? 1 : 0.5,
                            }}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;