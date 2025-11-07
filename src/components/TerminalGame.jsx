import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateGameSequences, getRoundTimeLimit, getCharDisplayClass, getSequenceTypeInfo } from '../lib/sequences';
import { calculateFinalScore, calculateEfficiency, calculateTimeBonus, formatTime } from '../lib/scoring';
import { triggerGlitch, shakeElement, successPulse } from '../lib/fx';

const TerminalGame = ({ config, onComplete, soundEnabled }) => {
  // Game state
  const [gameState, setGameState] = useState('setup'); // 'setup', 'playing', 'round', 'paused', 'finished'
  const [currentRound, setCurrentRound] = useState(0);
  const [sequences, setSequences] = useState([]);
  const [currentSequence, setCurrentSequence] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [windowLostFocus, setWindowLostFocus] = useState(false);

  // Metrics tracking
  const [roundStartTime, setRoundStartTime] = useState(0);
  const [timeToFirstKey, setTimeToFirstKey] = useState(null);
  const [errors, setErrors] = useState(0);
  const [backspaces, setBackspaces] = useState(0);
  const [roundMetrics, setRoundMetrics] = useState([]);

  // UI refs
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const roundTimerRef = useRef(null);

  // Initialize game
  useEffect(() => {
    const gameSequences = generateGameSequences(config);
    setSequences(gameSequences);
  }, [config]);

  // Window focus handling
  useEffect(() => {
    const handleFocus = () => setWindowLostFocus(false);
    const handleBlur = () => {
      if (gameState === 'round' && !isPaused) {
        setWindowLostFocus(true);
        // Optional: Auto-pause on focus loss
        // handlePause();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [gameState, isPaused]);

  // Timer management
  useEffect(() => {
    if (gameState === 'round' && timeRemaining > 0 && !isPaused) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 100);
      }, 100);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    } else if (timeRemaining <= 0 && gameState === 'round') {
      handleRoundTimeout();
    }
  }, [timeRemaining, gameState, isPaused]);

  // Start game
  const startGame = () => {
    setGameState('playing');
    setCurrentRound(1);
    startRound(1);
  };

  // Start a specific round
  const startRound = (roundNumber) => {
    if (roundNumber > sequences.length) {
      finishGame();
      return;
    }

    const sequence = sequences[roundNumber - 1];
    setCurrentSequence(sequence);
    setUserInput('');
    setTimeRemaining(getRoundTimeLimit(roundNumber, config));
    setRoundStartTime(Date.now());
    setTimeToFirstKey(null);
    setErrors(0);
    setBackspaces(0);
    setGameState('round');
    setIsPaused(false);

    // Focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    // Play start sound if enabled
    if (soundEnabled) {
      playSound('roundStart');
    }
  };

  // Handle round timeout
  const handleRoundTimeout = () => {
    const metrics = calculateRoundMetrics(false); // Not finished on time
    setRoundMetrics(prev => [...prev, metrics]);

    // Glitch effect for timeout
    const terminal = document.querySelector('.terminal');
    if (terminal) {
      triggerGlitch(terminal, 500);
    }

    // Play timeout sound
    if (soundEnabled) {
      playSound('timeout');
    }

    // Continue to next round after delay
    setTimeout(() => {
      setCurrentRound(prev => prev + 1);
      startRound(currentRound + 1);
    }, 2000);
  };

  // Handle round completion
  const handleRoundComplete = () => {
    const metrics = calculateRoundMetrics(true); // Finished on time
    setRoundMetrics(prev => [...prev, metrics]);

    // Success effects
    const terminal = document.querySelector('.terminal');
    if (terminal) {
      successPulse(terminal);
    }

    // Play success sound
    if (soundEnabled) {
      playSound('success');
    }

    // Continue to next round
    setTimeout(() => {
      setCurrentRound(prev => prev + 1);
      if (currentRound < sequences.length) {
        startRound(currentRound + 1);
      } else {
        finishGame();
      }
    }, 1500);
  };

  // Calculate metrics for current round
  const calculateRoundMetrics = (finishedOnTime) => {
    if (!currentSequence) return null;

    const timeToFinish = Date.now() - roundStartTime;
    const accuracy = calculateAccuracy(userInput, currentSequence.text);
    const efficiency = calculateEfficiency({
      round: currentRound,
      sequence: currentSequence.text,
      timeToFirstKey: timeToFirstKey || 0,
      timeToFinish,
      errors,
      backspaces,
      accuracy,
      finishedOnTime,
      timeBonus: 0,
      efficiency: 0
    });
    const timeBonus = calculateTimeBonus({
      round: currentRound,
      sequence: currentSequence.text,
      timeToFirstKey: timeToFirstKey || 0,
      timeToFinish,
      errors,
      backspaces,
      accuracy,
      finishedOnTime,
      timeBonus: 0,
      efficiency
    });

    return {
      round: currentRound,
      sequence: currentSequence.text,
      timeToFirstKey: timeToFirstKey || 0,
      timeToFinish,
      errors,
      backspaces,
      accuracy,
      finishedOnTime,
      timeBonus,
      efficiency
    };
  };

  // Calculate accuracy percentage
  const calculateAccuracy = (input, target) => {
    if (target.length === 0) return 100;

    let correct = 0;
    for (let i = 0; i < Math.min(input.length, target.length); i++) {
      if (input[i].toUpperCase() === target[i].toUpperCase()) {
        correct++;
      }
    }

    return Math.round((correct / target.length) * 100);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;

    // Track first key timing
    if (!timeToFirstKey && value.length > 0) {
      setTimeToFirstKey(Date.now() - roundStartTime);
    }

    // Check for errors (new character doesn't match)
    if (value.length > userInput.length && currentSequence) {
      const newCharIndex = value.length - 1;
      if (value[newCharIndex].toUpperCase() !== currentSequence.text[newCharIndex].toUpperCase()) {
        setErrors(prev => prev + 1);

        // Shake effect for errors
        if (inputRef.current) {
          shakeElement(inputRef.current);
        }

        // Play error sound
        if (soundEnabled) {
          playSound('error');
        }
      }
    }

    // Track backspaces
    if (value.length < userInput.length) {
      setBackspaces(prev => prev + 1);
    }

    setUserInput(value);

    // Check for completion
    if (currentSequence && value.replace(/\s+/g, '').length >= currentSequence.text.replace(/\s+/g, '').length) {
      const isCorrect = value.replace(/\s+/g, '').toUpperCase() === currentSequence.text.replace(/\s+/g, '').toUpperCase();
      if (isCorrect) {
        handleRoundComplete();
      } else {
        // Incorrect completion - mark as error
        setErrors(prev => prev + 1);
        if (soundEnabled) {
          playSound('error');
        }
      }
    }
  };

  // Pause/Resume functionality
  const togglePause = () => {
    if (gameState === 'round') {
      setIsPaused(!isPaused);
      if (soundEnabled) {
        playSound(isPaused ? 'resume' : 'pause');
      }
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      togglePause();
    }

    // Prevent paste
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      e.preventDefault();
    }
  };

  // Finish game and calculate final score
  const finishGame = () => {
    setGameState('finished');
    const finalScore = calculateFinalScore(roundMetrics);
    onComplete?.(finalScore);

    // Play finish sound
    if (soundEnabled) {
      playSound('gameComplete');
    }
  };

  // Simple sound playing (placeholder - would use actual audio files)
  const playSound = (soundType) => {
    if (!soundEnabled) return;

    // Create oscillator for simple beep sounds
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different frequencies for different sounds
      const frequencies = {
        roundStart: 800,
        success: 1200,
        error: 300,
        timeout: 200,
        gameComplete: 1500,
        pause: 600,
        resume: 700
      };

      oscillator.frequency.value = frequencies[soundType] || 600;
      oscillator.type = 'square';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Audio context not available or failed
    }
  };

  // Render sequence with character-by-character feedback
  const renderSequence = () => {
    if (!currentSequence) return null;

    const targetText = currentSequence.text.replace(/\s+/g, ''); // Remove spaces for display
    const inputText = userInput.replace(/\s+/g, '');

    return (
      <div className="terminal-text text-lg md:text-xl leading-relaxed">
        {targetText.split('').map((char, index) => {
          const displayClass = getCharDisplayClass(index, inputText, targetText);
          return (
            <span key={index} className={displayClass}>
              {char}
            </span>
          );
        })}
        <span className="terminal-cursor" />
      </div>
    );
  };

  // Get sequence type info
  const sequenceTypeInfo = currentSequence ? getSequenceTypeInfo(currentSequence.type) : null;

  return (
    <motion.section
      className="min-h-screen bg-gradient-to-br from-cyber-black via-bg to-cyber-black flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto max-w-4xl">
        {/* Game Setup Screen */}
        <AnimatePresence>
          {gameState === 'setup' && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="cyber-panel p-8 mb-8">
                <h2 className="font-orbitron font-bold text-3xl md:text-4xl mb-6 neon-text-cyan">
                  NEURAL TERMINAL
                </h2>
                <div className="text-left max-w-2xl mx-auto space-y-4 mb-8">
                  <div className="flex justify-between items-center py-2 border-b border-cyan/20">
                    <span className="text-muted">Rounds:</span>
                    <span className="text-cyan font-bold">{config.totalRounds}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-cyan/20">
                    <span className="text-muted">Difficulty:</span>
                    <span className="text-cyan font-bold capitalize">{config.difficulty}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-cyan/20">
                    <span className="text-muted">Sound:</span>
                    <span className="text-cyan font-bold">{soundEnabled ? 'ON' : 'OFF'}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-inter font-semibold text-cyan mb-4">Instructions:</h3>
                  <ul className="text-left text-sm text-muted space-y-2 font-fira">
                    <li>• Type the displayed sequences exactly as shown</li>
                    <li>• Complete each round before time runs out</li>
                    <li>• Press ESC to pause during gameplay</li>
                    <li>• Accuracy and speed both affect your score</li>
                    <li>• Your performance determines your Ghostwave role</li>
                  </ul>
                </div>

                <button
                  className="cyber-button text-lg px-8 py-4"
                  onClick={startGame}
                >
                  INITIALIZE TERMINAL
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Playing Screen */}
        <AnimatePresence>
          {gameState === 'round' && currentSequence && (
            <motion.div
              className="cyber-panel p-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {/* Game Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted">Round</span>
                  <span className="font-orbitron font-bold text-xl text-cyan">
                    {currentRound}/{config.totalRounds}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  {sequenceTypeInfo && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{sequenceTypeInfo.icon}</span>
                      <span className="text-sm text-muted">{sequenceTypeInfo.name}</span>
                    </div>
                  )}
                  <button
                    className="p-2 rounded border border-cyan/30 hover:border-cyan transition-colors"
                    onClick={togglePause}
                  >
                    <span className="text-xl">{isPaused ? '▶️' : '⏸️'}</span>
                  </button>
                </div>
              </div>

              {/* Timer Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted">Time Remaining</span>
                  <span className="text-sm font-bold text-cyan">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: '100%' }}
                    animate={{
                      width: `${(timeRemaining / getRoundTimeLimit(currentRound, config)) * 100}%`
                    }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>

              {/* Sequence Display */}
              <div className="terminal mb-6 min-h-[120px] flex items-center justify-center">
                {!isPaused ? renderSequence() : (
                  <div className="text-center">
                    <div className="text-2xl mb-4">⏸️</div>
                    <div className="text-cyan font-bold">PAUSED</div>
                    <div className="text-sm text-muted mt-2">Press ESC to resume</div>
                  </div>
                )}
              </div>

              {/* Hidden Input */}
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="sr-only"
                autoFocus
                disabled={isPaused}
              />

              {/* Metrics Display */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="cyber-panel p-4">
                  <div className="text-2xl font-bold text-cyan">{errors}</div>
                  <div className="text-xs text-muted">Errors</div>
                </div>
                <div className="cyber-panel p-4">
                  <div className="text-2xl font-bold text-cyan">
                    {calculateAccuracy(userInput, currentSequence.text)}%
                  </div>
                  <div className="text-xs text-muted">Accuracy</div>
                </div>
                <div className="cyber-panel p-4">
                  <div className="text-2xl font-bold text-cyan">{backspaces}</div>
                  <div className="text-xs text-muted">Corrections</div>
                </div>
              </div>

              {/* Focus Warning */}
              <AnimatePresence>
                {windowLostFocus && (
                  <motion.div
                    className="mt-4 p-4 bg-yellow-900/20 border border-yellow-400/30 rounded-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="flex items-center space-x-2 text-yellow-400">
                      <span>⚠️</span>
                      <span className="text-sm">Window focus lost - this may affect your score</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause Overlay */}
        <AnimatePresence>
          {isPaused && gameState === 'round' && (
            <motion.div
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="cyber-panel p-8 text-center max-w-md">
                <h3 className="font-orbitron font-bold text-2xl text-cyan mb-4">GAME PAUSED</h3>
                <p className="text-muted mb-6">Press ESC to resume the game</p>
                <button
                  className="cyber-button"
                  onClick={togglePause}
                >
                  RESUME
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default TerminalGame;