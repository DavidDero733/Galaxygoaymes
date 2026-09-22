import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Power, ShieldAlert, Cpu } from 'lucide-react';
import { ps2Audio } from '../utils/ps2Audio';

interface PS2BootIntroProps {
  onComplete: () => void;
}

export const PS2BootIntro: React.FC<PS2BootIntroProps> = ({ onComplete }) => {
  const [bootState, setBootState] = useState<'sceo' | 'system' | 'complete'>('sceo');

  useEffect(() => {
    // Play sound safely
    try {
      ps2Audio.playBoot();
    } catch (e) {}

    const timer1 = setTimeout(() => {
      setBootState('system');
    }, 1000);

    const timer2 = setTimeout(() => {
      setBootState('complete');
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[300] bg-[#000108] flex items-center justify-center overflow-hidden font-mono select-none">
      
      {/* Ambient Outer Blue Halo Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/[0.03] blur-[140px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {bootState === 'sceo' && (
          <motion.div
            key="sceo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center text-center p-6"
          >
            <motion.h2 
              initial={{ letterSpacing: '0.1em' }}
              animate={{ letterSpacing: '0.35em' }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="text-white text-sm md:text-md uppercase font-light tracking-[0.35em] text-neutral-300 select-none pb-2"
            >
              GALAXY COMPUTER ENTERTAINMENT
            </motion.h2>
          </motion.div>
        )}

        {bootState === 'system' && (
          <motion.div
            key="system"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.15, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="relative flex flex-col items-center justify-center w-full h-full max-w-6xl px-8"
          >
            {/* rising 3D-like light particle crystals/towers representing memory blocks */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-35 z-0">
              <div className="flex gap-4 md:gap-7 items-end mt-20">
                {[55, 140, 80, 190, 110, 220, 60, 160, 95].map((height, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: height * 0.7, opacity: [0, 0.4, 0.25] }}
                    transition={{ 
                      delay: idx * 0.05, 
                      duration: 1.5, 
                      ease: [0.25, 1, 0.5, 1] 
                    }}
                    className="w-1.5 md:w-3 bg-gradient-to-t from-cyan-900 via-blue-500/50 to-white/90 rounded-t-xs"
                    style={{
                      boxShadow: '0 0 20px rgba(14,116,144,0.3), 0 0 40px rgba(59,130,246,0.15)',
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="relative text-center z-10 space-y-4">
              <motion.h1 
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="text-4xl md:text-5xl font-extrabold italic tracking-[0.25em] text-cyan-400 font-sans drop-shadow-[0_0_25px_rgba(34,211,238,0.6)] uppercase"
              >
                GALAXY 2
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.4 }}
                className="text-[10px] text-gray-400 tracking-[0.3em] uppercase flex items-center justify-center gap-1.5"
              >
                <div className="w-1.5 h-1.5 bg-green-500 animate-ping rounded-full" />
                LOADING MEMORY CARD (8MB)
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skipping button for instant entrance */}
      <button
        onClick={() => {
          setBootState('complete');
          onComplete();
        }}
        className="absolute bottom-6 right-6 border border-white/10 hover:border-white/30 text-white/40 hover:text-white px-3 py-1.5 text-[10px] tracking-widest uppercase transition-all duration-200 bg-black/40 backdrop-blur-md rounded-md cursor-pointer z-[350]"
      >
        Skip Intro [ X ]
      </button>
    </div>
  );
};
