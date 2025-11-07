import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createDigitalRain, triggerGlitch, typewriterEffect } from '../lib/fx';

const AccessGate = onBreach => {
  const [isBreaching, setIsBreaching] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const gateRef = useRef(null);
  const textRef = useRef(null);

  const fullText = 'NEOCITY // GHOSTWAVE — ACCESS: PENDING';

  useEffect(() => {
    // Typewriter effect for main text
    if (textRef.current && !isBreaching) {
      typewriterEffect(textRef.current, fullText, 60);
    }

    // Digital rain effect
    if (gateRef.current && !gateOpen) {
      createDigitalRain(gateRef.current, 8000);
    }
  }, [gateOpen, isBreaching]);

  const handleBreach = async () => {
    if (isBreaching || gateOpen) return;

    setIsBreaching(true);

    // Glitch effect on breach
    if (textRef.current) {
      triggerGlitch(textRef.current, 500);
    }

    // RGB split animation
    setTimeout(() => {
      setGateOpen(true);
      onBreach?.();
    }, 800);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleBreach();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isBreaching, gateOpen]);

  return (
    <motion.section
      ref={gateRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-cyber-black via-bg to-cyber-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="0.5"
              />
            </pattern>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#ff2dd4" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#7b3cff" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Gate Fragments */}
      <AnimatePresence>
        {!gateOpen && (
          <>
            {/* Top Fragment */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-1/2 cyber-panel border-b-2 border-cyan"
              initial={{ y: 0 }}
              animate={{ y: isBreaching ? '-100%' : 0 }}
              exit={{ y: '-100%' }}
              transition={{
                duration: 0.8,
                ease: 'easeIn',
                delay: isBreaching ? 0.2 : 0
              }}
            />

            {/* Bottom Fragment */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1/2 cyber-panel border-t-2 border-cyan"
              initial={{ y: 0 }}
              animate={{ y: isBreaching ? '100%' : 0 }}
              exit={{ y: '100%' }}
              transition={{
                duration: 0.8,
                ease: 'easeIn',
                delay: isBreaching ? 0.2 : 0
              }}
            />

            {/* Left Fragment */}
            <motion.div
              className="absolute top-1/2 left-0 w-1/4 h-16 cyber-panel border-r-2 border-cyan"
              initial={{ x: 0 }}
              animate={{ x: isBreaching ? '-200%' : 0 }}
              exit={{ x: '-200%' }}
              transition={{
                duration: 0.6,
                ease: 'easeIn',
                delay: isBreaching ? 0.1 : 0
              }}
            />

            {/* Right Fragment */}
            <motion.div
              className="absolute top-1/2 right-0 w-1/4 h-16 cyber-panel border-l-2 border-cyan"
              initial={{ x: 0 }}
              animate={{ x: isBreaching ? '200%' : 0 }}
              exit={{ x: '200%' }}
              transition={{
                duration: 0.6,
                ease: 'easeIn',
                delay: isBreaching ? 0.1 : 0
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {/* Main Title */}
        <motion.h1
          ref={textRef}
          className="font-orbitron font-black text-4xl md:text-6xl lg:text-7xl mb-8 neon-text-cyan leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Subtitle */}
        <motion.p
          className="font-fira text-lg md:text-xl text-muted mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          A fictional recruitment experience. Test your skills in the neural terminal
          and discover your role in the Ghostwave collective.
        </motion.p>

        {/* Breach Button */}
        <AnimatePresence>
          {!isBreaching && !gateOpen && (
            <motion.button
              className="cyber-button text-lg md:text-xl px-8 py-4 relative overflow-hidden group"
              onClick={handleBreach}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isBreaching}
            >
              <span className="relative z-10 font-bold tracking-wider">
                BREACH
              </span>

              {/* Hover Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan/20 to-magenta/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Loading Spinner */}
              <AnimatePresence>
                {isBreaching && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-black/80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <motion.div
          className="mt-12 text-sm text-muted/60 font-fira"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <p>Press ENTER or SPACE to breach</p>
          <p className="mt-2">Keyboard navigation preferred</p>
        </motion.div>

        {/* Status Indicators */}
        <motion.div
          className="fixed bottom-8 left-8 space-y-2 text-left"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full shadow-neon-green animate-pulse" />
            <span className="text-xs text-green-400 font-fira">SYSTEM ONLINE</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan rounded-full shadow-neon-cyan animate-pulse" />
            <span className="text-xs text-cyan font-fira">NEURAL LINK ACTIVE</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-neon-green animate-pulse" />
            <span className="text-xs text-yellow-400 font-fira">
              {gateOpen ? 'ACCESS GRANTED' : 'AWAITING AUTH'}
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* RGB Split Effect Overlay */}
      <AnimatePresence>
        {isBreaching && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan/20 via-transparent to-magenta/20 animate-rgb-shift" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breach Success Particles */}
      <AnimatePresence>
        {gateOpen && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan rounded-full"
                initial={{
                  x: '50%',
                  y: '50%',
                  opacity: 1
                }}
                animate={{
                  x: `${Math.random() * 200 - 100}%`,
                  y: `${Math.random() * 200 - 100}%`,
                  opacity: 0
                }}
                transition={{
                  duration: 1 + Math.random() * 0.5,
                  ease: 'easeOut',
                  delay: Math.random() * 0.3
                }}
                style={{
                  boxShadow: '0 0 10px #00f0ff'
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default AccessGate;