import React from 'react';
import { useMood } from '../../context/MoodContext';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomCursor from './CustomCursor';
import PsyEffects from './PsyEffects';

const Layout = ({ children }) => {
    const { isNeon, vibe } = useMood();

    // Determiniamo se siamo in Natural per la selezione testo
    const isNatural = vibe === 'natural' && !isNeon;

    return (
        /* RIMOSSE le classi bg-psy-black e bg-raw-sand.
           Ora il Layout usa la classe globale 'bg-main' che punta alla variabile CSS.
           Questo elimina ogni possibile "striscia" o stacco di colore.
        */
        <div className={`min-h-screen flex flex-col transition-colors duration-700 bg-main text-[var(--text-main)] ${isNatural
                ? 'selection:bg-raw-leaf selection:text-white'
                : 'selection:bg-psy-green selection:text-psy-black'
            }`}>
            <PsyEffects />
            <CustomCursor />
            <Navbar />

            {/* Il wrapper della distorsione non deve avere bordi o padding extra 
                che potrebbero causare linee fantasma.
            */}
            <div className={`flex-grow flex flex-col ${isNeon ? 'psy-distort' : ''}`}>
                <main className="relative z-10 flex-grow w-full">
                    {children}
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default Layout;