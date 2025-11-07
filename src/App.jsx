import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeEffects, cleanupEffects } from './lib/fx';

// Import components
import HeaderHud from './components/HeaderHud';
import AccessGate from './components/AccessGate';
import LoreShards from './components/LoreShards';
import TerminalGame from './components/TerminalGame';
import RoleReveal from './components/RoleReveal';
import SettingsDrawer from './components/SettingsDrawer';

// Import styles
import './styles/theme.css';

const App = () => {
  // Application state
  const [currentSection, setCurrentSection] = useState('access');
  const [gameScore, setGameScore] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(() => {
    // Load settings from localStorage or use defaults
    const savedSettings = localStorage.getItem('neocity-settings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        console.warn('Failed to parse saved settings, using defaults');
      }
    }
    return {
      totalRounds: 3,
      difficulty: 'standard',
      sound: false,
      visualMode: 'standard'
    };
  });

  // Apply visual mode settings
  useEffect(() => {
    const root = document.documentElement;

    // Set CSS variables based on visual mode
    switch (settings.visualMode) {
      case 'low':
        root.style.setProperty('--animation-duration', '0.01ms');
        root.style.setProperty('--blur-amount', '0px');
        break;
      case 'high':
        root.style.setProperty('--animation-duration', '2s');
        root.style.setProperty('--blur-amount', '12px');
        break;
      default:
        root.style.setProperty('--animation-duration', '1s');
        root.style.setProperty('--blur-amount', '8px');
    }

    // Apply reduced motion if system prefers it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.style.setProperty('--animation-duration', '0.01ms');
    }
  }, [settings.visualMode]);

  // Initialize effects on mount
  useEffect(() => {
    initializeEffects();

    return () => {
      cleanupEffects();
    };
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('neocity-settings', JSON.stringify(settings));
  }, [settings]);

  // Handle section navigation
  const handleSectionChange = useCallback((section) => {
    // Only allow forward navigation or settings
    if (section === 'settings') {
      setSettingsOpen(true);
      return;
    }

    const sectionOrder = ['access', 'lore', 'game', 'reveal'];
    const currentIndex = sectionOrder.indexOf(currentSection);
    const targetIndex = sectionOrder.indexOf(section);

    // Allow navigation to next section or back to current
    if (targetIndex === currentIndex + 1 || targetIndex <= currentIndex) {
      setCurrentSection(section);
    }
  }, [currentSection]);

  // Handle game completion
  const handleGameComplete = useCallback((score) => {
    setGameScore(score);
    setCurrentSection('reveal');
  }, []);

  // Handle settings change
  const handleSettingsChange = useCallback((newSettings) => {
    setSettings(newSettings);
  }, []);

  // Handle game restart
  const handleGameRestart = useCallback(() => {
    setGameScore(null);
    setCurrentSection('access');
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Global shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setSettingsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Render current section
  const renderSection = () => {
    switch (currentSection) {
      case 'access':
        return (
          <AccessGate
            onBreach={() => handleSectionChange('lore')}
          />
        );
      case 'lore':
        return (
          <LoreShards
            onContinue={() => handleSectionChange('game')}
          />
        );
      case 'game':
        return (
          <TerminalGame
            config={{
              totalRounds: settings.totalRounds,
              difficulty: settings.difficulty
            }}
            soundEnabled={settings.sound}
            onComplete={handleGameComplete}
          />
        );
      case 'reveal':
        return (
          <RoleReveal
            gameScore={gameScore}
            soundEnabled={settings.sound}
            onRestart={handleGameRestart}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-bg text-cyan overflow-x-hidden">
      {/* Header Navigation */}
      <HeaderHud
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        onSettingsToggle={() => setSettingsOpen(true)}
        soundEnabled={settings.sound}
        onSoundToggle={() => handleSettingsChange({
          ...settings,
          sound: !settings.sound
        })}
      />

      {/* Main Content */}
      <main className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Settings Drawer */}
      <SettingsDrawer
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        soundEnabled={settings.sound}
      />

      {/* Global Loading Screen */}
      <div className="fixed inset-0 bg-bg z-[100] pointer-events-none opacity-0 transition-opacity duration-300" />

      {/* Focus Management for Accessibility */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Current section: {currentSection.replace('-', ' ')}
        {gameScore && `, Final score: ${gameScore.totalScore}%, Role: ${gameScore.role}`}
      </div>

      {/* Skip to Main Content (Accessibility) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-cyan text-black px-4 py-2 rounded font-inter font-semibold z-50"
      >
        Skip to main content
      </a>

      {/* Main Content Landmark */}
      <div id="main-content" role="main">
        {/* Content is rendered in the sections above */}
      </div>
    </div>
  );
};

export default App;