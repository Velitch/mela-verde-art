import React from 'react';
import { useMood } from '../../context/MoodContext';

const PsyEffects = () => {
    const { isNeon } = useMood();

    return (
        <>
            {/* Motore di distorsione SVG */}
            <svg className="hidden">
                <filter id="psy-noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale={isNeon ? "8" : "0"} />
                </filter>
            </svg>

            {/* Luci Ambientali (Glow) */}
            {isNeon && (
                <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-50">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-psy-green/10 blur-[120px] animate-pulse-slow" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-psy-purple/10 blur-[120px] animate-pulse-slow" />
                </div>
            )}
        </>
    );
};

export default PsyEffects;