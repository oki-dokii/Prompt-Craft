import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeEffects } from '../lib/fx';

const HeaderHud = ({ currentSection, onSectionChange, onSettingsToggle, soundEnabled, onSoundToggle }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    initializeEffects();
  }, []);

  const sections = [
    { id: 'access', name: 'ACCESS', icon: '🔓' },
    { id: 'lore', name: 'LORE', icon: '📖' },
    { id: 'game', name: 'TERMINAL', icon: '💻' },
    { id: 'reveal', name: 'ROLE', icon: '🎭' }
  ];

  const handleSectionNavigation = (sectionId) => {
    onSectionChange?.(sectionId);
    setIsMobileMenuOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 cyber-panel backdrop-blur-cyber border-b border-cyan/30"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Branding */}
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="font-orbitron font-bold text-xl md:text-2xl neon-text-cyan">
                NEOCITY
              </h1>
              <span className="text-cyan/60 font-fira text-sm">//</span>
              <h2 className="font-orbitron font-bold text-lg md:text-xl neon-text-magenta">
                GHOSTWAVE
              </h2>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  className={`font-inter text-sm font-semibold tracking-wider transition-all duration-300 ${
                    currentSection === section.id
                      ? 'text-cyan neon-text'
                      : 'text-muted hover:text-cyan'
                  }`}
                  onClick={() => handleSectionNavigation(section.id)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.name}
                </motion.button>
              ))}
            </nav>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Sound Toggle */}
              <motion.button
                className="p-2 rounded-lg border border-cyan/30 hover:border-cyan transition-all duration-300"
                onClick={onSoundToggle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
              >
                <span className="text-xl">
                  {soundEnabled ? '🔊' : '🔇'}
                </span>
              </motion.button>

              {/* Settings */}
              <motion.button
                className="p-2 rounded-lg border border-cyan/30 hover:border-cyan transition-all duration-300"
                onClick={onSettingsToggle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Settings"
              >
                <span className="text-xl">⚙️</span>
              </motion.button>

              {/* Mobile Menu Toggle */}
              <motion.button
                className="md:hidden p-2 rounded-lg border border-cyan/30 hover:border-cyan transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle menu"
              >
                <div className="w-6 h-5 flex flex-col justify-center space-y-1">
                  <motion.span
                    className="block w-full h-0.5 bg-cyan"
                    animate={{
                      rotate: isMobileMenuOpen ? 45 : 0,
                      y: isMobileMenuOpen ? 8 : 0
                    }}
                  />
                  <motion.span
                    className="block w-full h-0.5 bg-cyan"
                    animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                  />
                  <motion.span
                    className="block w-full h-0.5 bg-cyan"
                    animate={{
                      rotate: isMobileMenuOpen ? -45 : 0,
                      y: isMobileMenuOpen ? -8 : 0
                    }}
                  />
                </div>
              </motion.button>
            </div>
          </div>

          {/* Section Progress Indicator */}
          <div className="mt-4 hidden md:block">
            <div className="flex items-center space-x-2">
              {sections.map((section, index) => (
                <React.Fragment key={section.id}>
                  <motion.div
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      currentSection === section.id
                        ? 'bg-cyan shadow-neon-cyan'
                        : currentSection && sections.findIndex(s => s.id === currentSection) > index
                        ? 'bg-magenta/60'
                        : 'bg-muted/30'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  />
                  {index < sections.length - 1 && (
                    <motion.div
                      className="flex-1 h-0.5 bg-gradient-to-r from-cyan/20 to-cyan/5"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Navigation Panel */}
            <motion.div
              className="absolute top-20 left-4 right-4 cyber-panel border border-cyan/30"
              initial={{ scale: 0.9, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <nav className="p-6 space-y-4">
                {sections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    className={`w-full text-left font-inter text-lg font-semibold tracking-wider py-3 px-4 rounded-lg transition-all duration-300 ${
                      currentSection === section.id
                        ? 'bg-cyan/20 text-cyan neon-text'
                        : 'text-muted hover:text-cyan hover:bg-cyan/10'
                    }`}
                    onClick={() => handleSectionNavigation(section.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="mr-3">{section.icon}</span>
                    {section.name}
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeaderHud;