import React, { createContext, useState, useContext, useEffect } from 'react';

const MoodContext = createContext();

export const MoodProvider = ({ children }) => {
    // IMPOSTAZIONE INIZIALE: Verde Neon su Blu Notte Profondo
    const [vibe, setVibe] = useState('psy');
    const [isNeon, setIsNeon] = useState(true);

    // Mappatura colori dinamici
    const getBgColor = (currentVibe, neon) => {
        // Se il neon è attivo, domina sempre il Blu Notte Profondo
        if (neon) return '#020617';

        switch (currentVibe) {
            case 'natural': return '#f4f1ea'; // Sabbia/Raw (Chiaro)
            case 'bdsm': return '#050000';    // Nero/Rosso scurissimo
            case 'all': return '#050a15';     // Blu Notte principale
            case 'psy': return '#020617';     // Fallback per psy senza neon
            default: return '#050a15';
        }
    };

    // Sincronizzazione variabili CSS Globali
    useEffect(() => {
        const bgColor = getBgColor(vibe, isNeon);

        // LOGICA DI CONTRASTO: 
        // Il testo diventa scuro (#1a1a1a) SOLO se siamo in natural E il neon è spento.
        const isLightMode = vibe === 'natural' && !isNeon;
        const textColor = isLightMode ? '#1a1a1a' : '#ffffff';

        // Iniettiamo le variabili CSS
        document.documentElement.style.setProperty('--bg-main', bgColor);
        document.documentElement.style.setProperty('--text-main', textColor);

        // Applichiamo i colori al body per garantire la leggibilità globale
        document.body.style.backgroundColor = bgColor;
        document.body.style.color = textColor;
        document.body.style.transition = 'background-color 0.8s ease, color 0.8s ease';
    }, [vibe, isNeon]);

    // Wrapper per cambiare il vibe con pulizia automatica del neon
    const updateVibe = (newVibe) => {
        if (newVibe === 'natural') {
            setIsNeon(false);
        } else if (newVibe === 'psy') {
            setIsNeon(true);
        }
        setVibe(newVibe);
    };

    return (
        <MoodContext.Provider value={{
            vibe,
            setVibe: updateVibe,
            isNeon,
            setIsNeon,
            getActiveColor: () => {
                // Se il neon è acceso, il verde domina
                if (isNeon) return '#39ff14';

                switch (vibe) {
                    case 'all': return '#ff00ff';     // Fucsia
                    case 'bdsm': return '#ff0000';    // Rosso
                    case 'natural': return '#2d5a27'; // Verde Bosco (scuro su sabbia)
                    case 'psy': return '#39ff14';     // Verde Neon
                    default: return '#ff00ff';
                }
            }
        }}>
            {children}
        </MoodContext.Provider>
    );
};

export const useMood = () => useContext(MoodContext);