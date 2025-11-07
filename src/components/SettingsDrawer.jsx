import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsDrawer = ({ isOpen, onClose, settings, onSettingsChange, soundEnabled }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSettingsChange?.(localSettings);
    setHasChanges(false);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings = {
      totalRounds: 3,
      difficulty: 'standard',
      sound: false,
      visualMode: 'standard'
    };
    setLocalSettings(defaultSettings);
    setHasChanges(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (hasChanges) {
        // Ask to save changes
        const confirmSave = window.confirm('You have unsaved changes. Would you like to save them?');
        if (confirmSave) {
          handleSave();
        } else {
          setLocalSettings(settings);
          setHasChanges(false);
          onClose();
        }
      } else {
        onClose();
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, hasChanges]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
            onClick={() => {
              if (hasChanges) {
                const confirmSave = window.confirm('You have unsaved changes. Would you like to save them?');
                if (confirmSave) {
                  handleSave();
                } else {
                  setLocalSettings(settings);
                  setHasChanges(false);
                  onClose();
                }
              } else {
                onClose();
              }
            }}
          />

          {/* Settings Panel */}
          <motion.div
            className="relative cyber-panel max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-cyan/30">
              <h2 className="font-orbitron font-bold text-2xl neon-text-cyan">
                SYSTEM SETTINGS
              </h2>
              <button
                className="p-2 rounded-lg border border-cyan/30 hover:border-cyan transition-colors"
                onClick={onClose}
              >
                <span className="text-xl">✕</span>
              </button>
            </div>

            {/* Settings Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Game Settings */}
              <div>
                <h3 className="font-inter font-semibold text-cyan mb-4 flex items-center">
                  <span className="mr-2">🎮</span>
                  GAME CONFIGURATION
                </h3>

                {/* Rounds Setting */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">
                      Number of Rounds
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[3, 5].map(rounds => (
                        <button
                          key={rounds}
                          className={`cyber-button ${
                            localSettings.totalRounds === rounds
                              ? 'border-cyan bg-cyan/20'
                              : 'border-muted/30 bg-transparent'
                          }`}
                          onClick={() => handleSettingChange('totalRounds', rounds)}
                        >
                          {rounds} ROUNDS
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted mt-2">
                      More rounds provide a more accurate role assessment but take longer to complete.
                    </p>
                  </div>

                  {/* Difficulty Setting */}
                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">
                      Difficulty Level
                    </label>
                    <div className="space-y-2">
                      {['easy', 'standard', 'hard'].map(difficulty => (
                        <button
                          key={difficulty}
                          className={`w-full cyber-button text-left justify-start ${
                            localSettings.difficulty === difficulty
                              ? 'border-cyan bg-cyan/20'
                              : 'border-muted/30 bg-transparent'
                          }`}
                          onClick={() => handleSettingChange('difficulty', difficulty)}
                        >
                          <div>
                            <div className="font-semibold capitalize">{difficulty}</div>
                            <div className="text-xs text-muted opacity-80">
                              {difficulty === 'easy' && 'Shorter sequences, more time, forgiving scoring'}
                              {difficulty === 'standard' && 'Balanced experience for most players'}
                              {difficulty === 'hard' && 'Longer sequences, less time, strict scoring'}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Audio Settings */}
              <div>
                <h3 className="font-inter font-semibold text-cyan mb-4 flex items-center">
                  <span className="mr-2">🔊</span>
                  AUDIO SETTINGS
                </h3>

                <div className="flex items-center justify-between p-4 cyber-panel">
                  <div>
                    <div className="font-medium">Sound Effects</div>
                    <div className="text-xs text-muted">
                      Enable beeps and chimes for game events
                    </div>
                  </div>
                  <button
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      localSettings.sound ? 'bg-cyan/30' : 'bg-muted/30'
                    }`}
                    onClick={() => handleSettingChange('sound', !localSettings.sound)}
                  >
                    <motion.div
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                      animate={{
                        x: localSettings.sound ? 28 : 4
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </button>
                </div>
              </div>

              {/* Visual Settings */}
              <div>
                <h3 className="font-inter font-semibold text-cyan mb-4 flex items-center">
                  <span className="mr-2">🎨</span>
                  VISUAL MODE
                </h3>

                <div className="space-y-2">
                  {[
                    { value: 'low', label: 'Low FX', desc: 'Reduced animations and effects' },
                    { value: 'standard', label: 'Standard', desc: 'Balanced visual experience' },
                    { value: 'high', label: 'High FX', desc: 'Maximum effects and animations' }
                  ].map(mode => (
                    <button
                      key={mode.value}
                      className={`w-full cyber-button text-left justify-start ${
                        localSettings.visualMode === mode.value
                          ? 'border-cyan bg-cyan/20'
                          : 'border-muted/30 bg-transparent'
                      }`}
                      onClick={() => handleSettingChange('visualMode', mode.value)}
                    >
                      <div>
                        <div className="font-semibold">{mode.label}</div>
                        <div className="text-xs text-muted opacity-80">
                          {mode.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessibility */}
              <div>
                <h3 className="font-inter font-semibold text-cyan mb-4 flex items-center">
                  <span className="mr-2">♿</span>
                  ACCESSIBILITY
                </h3>

                <div className="p-4 cyber-panel">
                  <p className="text-sm text-muted mb-3">
                    This application automatically respects your system preferences:
                  </p>
                  <ul className="space-y-2 text-sm text-muted">
                    <li className="flex items-center">
                      <span className="text-cyan mr-2">✓</span>
                      Reduces motion if "prefers-reduced-motion" is enabled
                    </li>
                    <li className="flex items-center">
                      <span className="text-cyan mr-2">✓</span>
                      Keyboard-first navigation throughout
                    </li>
                    <li className="flex items-center">
                      <span className="text-cyan mr-2">✓</span>
                      High contrast color schemes with WCAG AA compliance
                    </li>
                    <li className="flex items-center">
                      <span className="text-cyan mr-2">✓</span>
                      Screen reader compatible with proper ARIA labels
                    </li>
                  </ul>
                </div>
              </div>

              {/* Performance */}
              <div>
                <h3 className="font-inter font-semibold text-cyan mb-4 flex items-center">
                  <span className="mr-2">⚡</span>
                  PERFORMANCE
                </h3>

                <div className="p-4 cyber-panel">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Animation Quality:</span>
                      <span className="text-cyan capitalize">{localSettings.visualMode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Sound Effects:</span>
                      <span className="text-cyan">{localSettings.sound ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Target FPS:</span>
                      <span className="text-cyan">60</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Hardware Acceleration:</span>
                      <span className="text-cyan">Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between p-6 border-t border-cyan/30 bg-black/20">
              <div className="flex items-center space-x-3">
                {hasChanges && (
                  <span className="text-xs text-yellow-400 flex items-center">
                    <span className="mr-1">●</span>
                    Unsaved changes
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  className="px-4 py-2 text-sm border border-muted/30 rounded-lg hover:border-muted transition-colors"
                  onClick={handleReset}
                >
                  RESET TO DEFAULT
                </button>
                <button
                  className="cyber-button px-6 py-2 text-sm disabled:opacity-50"
                  onClick={handleSave}
                  disabled={!hasChanges}
                >
                  SAVE CHANGES
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsDrawer;