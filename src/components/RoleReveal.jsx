import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createParticles, typewriterEffect, holoShimmer } from '../lib/fx';
import { getRoleInfo, getGradeLetter, formatTime, generatePerformanceSummary } from '../lib/scoring';

const RoleReveal = ({ gameScore, onRestart, soundEnabled }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [shareText, setShareText] = useState('');
  const [copied, setCopied] = useState(false);
  const roleCardRef = useRef(null);
  const roleRef = useRef(null);

  const roleInfo = getRoleInfo(gameScore.role);
  const gradeLetter = getGradeLetter(gameScore.totalScore);
  const performanceSummaries = generatePerformanceSummary(gameScore);

  useEffect(() => {
    // Trigger role reveal animation
    if (roleRef.current) {
      setTimeout(() => {
        holoShimmer(roleRef.current);
      }, 1000);
    }

    // Create celebration particles
    if (roleCardRef.current) {
      setTimeout(() => {
        const particleColor = roleInfo?.color || 'cyan';
        createParticles(roleCardRef.current, 40, `var(--${particleColor})`);
      }, 1500);
    }

    // Generate share text
    const shareMessage = `I've been assigned the role of ${gameScore.role} in NeoCity Ghostwave with a score of ${gameScore.totalScore} (${gradeLetter})! 🌆✨`;
    setShareText(shareMessage);

    // Play reveal sound
    if (soundEnabled) {
      playSound('reveal');
    }
  }, [gameScore, roleInfo, gradeLetter, soundEnabled]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'NeoCity Ghostwave - Role Assignment',
          text: shareText,
          url: window.location.href
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }

      if (soundEnabled) {
        playSound('share');
      }
    } catch (error) {
      // Handle error silently
    }
  };

  const handleRestart = () => {
    if (soundEnabled) {
      playSound('restart');
    }
    onRestart?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRestart();
    } else if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleShare();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simple sound playing
  const playSound = (soundType) => {
    if (!soundEnabled) return;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const frequencies = {
        reveal: 1000,
        share: 800,
        restart: 600
      };

      oscillator.frequency.value = frequencies[soundType] || 600;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      // Audio context not available
    }
  };

  return (
    <motion.section
      className="min-h-screen bg-gradient-to-br from-cyber-black via-bg to-cyber-black flex items-center justify-center p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full filter blur-3xl animate-pulse"
          style={{ backgroundColor: `var(--${roleInfo?.color || 'cyan'})` }}
        />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan/20 rounded-full filter blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          ref={roleCardRef}
          className="cyber-panel p-8 mb-8 relative"
          initial={{ scale: 0.8, opacity: 0, rotateY: -180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Role Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="font-orbitron font-bold text-3xl md:text-4xl mb-4 neon-text-cyan">
              ROLE ASSIGNED
            </h2>
            <div className="flex justify-center items-center space-x-4 mb-4">
              <motion.div
                className="text-6xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
              >
                {roleInfo?.icon || '🎭'}
              </motion.div>
              <div className="text-left">
                <h3
                  ref={roleRef}
                  className={`font-orbitron font-black text-4xl md:text-5xl mb-2 neon-text-${roleInfo?.color || 'cyan'}`}
                  style={{
                    textShadow: `0 0 20px var(--${roleInfo?.color || 'cyan'}), 0 0 40px var(--${roleInfo?.color || 'cyan'})`
                  }}
                >
                  {gameScore.role}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`text-2xl font-bold text-${roleInfo?.color || 'cyan'}`}>
                    {gameScore.totalScore}
                  </span>
                  <span className="text-2xl text-muted">({gradeLetter})</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Role Description */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <p className="font-fira text-lg text-muted italic leading-relaxed">
              "{gameScore.roleDescription}"
            </p>
          </motion.div>

          {/* Score Metrics */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          >
            <div className="cyber-panel p-4 text-center">
              <div className="text-2xl font-bold text-cyan">{gameScore.totalScore}%</div>
              <div className="text-xs text-muted">Final Score</div>
            </div>
            <div className="cyber-panel p-4 text-center">
              <div className="text-2xl font-bold text-cyan">{gameScore.averageAccuracy}%</div>
              <div className="text-xs text-muted">Accuracy</div>
            </div>
            <div className="cyber-panel p-4 text-center">
              <div className="text-2xl font-bold text-cyan">{gameScore.averageSpeed.toFixed(1)}</div>
              <div className="text-xs text-muted">Chars/Sec</div>
            </div>
            <div className="cyber-panel p-4 text-center">
              <div className="text-2xl font-bold text-cyan">{gameScore.totalErrors}</div>
              <div className="text-xs text-muted">Total Errors</div>
            </div>
          </motion.div>

          {/* Performance Summary */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <div className="flex justify-center mb-4">
              <button
                className="cyber-button text-sm px-4 py-2"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'HIDE' : 'SHOW'} PERFORMANCE DETAILS
              </button>
            </div>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  className="cyber-panel p-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="font-inter font-semibold text-cyan mb-4">Performance Analysis</h4>
                  <div className="space-y-2">
                    {performanceSummaries.map((summary, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-cyan">▸</span>
                        <span className="text-sm text-muted">{summary}</span>
                      </div>
                    ))}
                  </div>

                  {/* Round Breakdown */}
                  <h4 className="font-inter font-semibold text-cyan mt-6 mb-4">Round Breakdown</h4>
                  <div className="space-y-2">
                    {gameScore.metrics.map((metric, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-cyan/10">
                        <span className="text-sm text-muted">Round {metric.round}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-xs text-muted">
                            {formatTime(metric.timeToFinish)}
                          </span>
                          <span className="text-sm font-bold text-cyan">
                            {metric.accuracy}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-cyan/20">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted">Total Time:</span>
                      <span className="text-cyan font-bold">
                        {formatTime(gameScore.totalTime)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4 }}
          >
            <button
              className="cyber-button flex items-center justify-center space-x-2"
              onClick={handleShare}
            >
              <span>📤</span>
              <span>{copied ? 'COPIED!' : 'SHARE RESULT'}</span>
            </button>
            <button
              className="cyber-button flex items-center justify-center space-x-2"
              onClick={handleRestart}
            >
              <span>🔄</span>
              <span>TRY AGAIN</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          className="text-center text-xs text-muted/60 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
        >
          <p>This is a fictional, aesthetic experience. No real recruitment, no data collection.</p>
          <p className="mt-2">Your role assignment is based solely on typing performance in this mini-game.</p>
        </motion.div>
      </div>

      {/* Confetti Effect for High Scores */}
      <AnimatePresence>
        {gameScore.totalScore >= 80 && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2"
                style={{
                  backgroundColor: `var(--${roleInfo?.color || 'cyan'})`,
                  left: `${Math.random() * 100}%`,
                  top: `-10px`
                }}
                animate={{
                  y: window.innerHeight + 20,
                  x: Math.random() * 200 - 100,
                  rotate: Math.random() * 360,
                  opacity: [1, 1, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  ease: 'linear',
                  delay: Math.random() * 2
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default RoleReveal;