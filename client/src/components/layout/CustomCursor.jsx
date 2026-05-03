import React, { useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useMood } from '../../context/MoodContext';

const CustomCursor = () => {
    const { isNeon } = useMood();
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 300 };
    const x = useSpring(cursorX, springConfig);
    const y = useSpring(cursorY, springConfig);

    const [isMobile, setIsMobile] = React.useState(false);

    // 1. Primo Hook
    useEffect(() => {
        if (window.matchMedia("(pointer: coarse)").matches) {
            setIsMobile(true);
        }
    }, []);

    // 2. Secondo Hook (DEVE stare prima del return null)
    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };
        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, [cursorX, cursorY]);

    // 3. ORA puoi fare il controllo per non renderizzare il cursore
    if (isMobile) return null;

    return (
        <motion.div
            style={{ x, y, translate: '-50% -50%' }}
            className={`fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference border-2 ${isNeon
                    ? 'bg-psy-green border-psy-green shadow-[0_0_15px_#39ff14]'
                    : 'bg-raw-leaf border-raw-leaf'
                }`}
        />
    );
};

export default CustomCursor;