import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { typewriterEffect, holoShimmer, createParticles } from '../lib/fx';

const LoreShards = onContinue => {
  const [selectedShard, setSelectedShard] = useState(null);
  const [deepLoreOpen, setDeepLoreOpen] = useState(false);
  const shardRefs = useRef([]);

  const loreShards = [
    {
      id: 'neural-nexus',
      title: 'Neural Nexus',
      category: 'tech',
      icon: '🧠',
      shortLore: 'The backbone of NeoCity\'s consciousness, where millions of minds connect in the digital sea.',
      deepLore: 'In the year 2077, the Neural Nexus became reality. A quantum network that transcends physical boundaries, allowing direct consciousness-to-consciousness communication. Built on crystalline data matrices and powered by zero-point energy, the Nexus is both heaven and hell—offering infinite knowledge while threatening to dissolve individual identity into the collective stream.',
      tags: ['technology', 'consciousness', 'network'],
      color: 'cyan'
    },
    {
      id: 'data-ghosts',
      title: 'Data Ghosts',
      category: 'faction',
      icon: '👻',
      shortLore: 'Information brokers who never leave traces, moving through systems like whispers in the dark.',
      deepLore: 'Data Ghosts are the masters of digital stealth. Born from the ashes of the old internet\'s hacktivist movements, they\'ve perfected the art of information warfare. Using quantum encryption and neural cloaking, they can infiltrate any system, extract any data, and vanish without leaving a single byte of evidence. They say the best Data Ghosts can steal your thoughts while you\'re thinking them.',
      tags: ['faction', 'stealth', 'information'],
      color: 'magenta'
    },
    {
      id: 'chrome-riders',
      title: 'Chrome Riders',
      category: 'faction',
      icon: '🏍️',
      shortLore: 'Street samurai with augmented reality, riding the neon highways on bikes of pure light.',
      deepLore: 'Chrome Riders are the nomads of the physical world. Enhanced with military-grade cybernetics and riding holographic motorcycles that phase through matter, they patrol the endless neon corridors of NeoCity. Each rider is bonded to their AI companion, creating a symbiotic relationship of human intuition and machine precision. They are the messengers, the protectors, and sometimes the judges of the streets.',
      tags: ['faction', 'cybernetics', 'transport'],
      color: 'violet'
    },
    {
      id: 'the-sprawl',
      title: 'The Sprawl',
      category: 'location',
      icon: '🏙️',
      shortLore: 'Endless neon corridors where data flows like water and dreams become reality.',
      deepLore: 'The Sprawl is what happened when urban planning met artificial intelligence. A self-organizing city that grows and adapts like a living organism. Towers of bio-luminescent materials stretch into the chem-clouded sky, while below, streets pulse with fiber-optic veins. Every surface is a screen, every shadow holds a secret, and every corner tells a story of someone who tried to hack the city itself.',
      tags: ['location', 'urban', 'technology'],
      color: 'holo'
    },
    {
      id: 'ghostwave-sector',
      title: 'Ghostwave Sector',
      category: 'location',
      icon: '📡',
      shortLore: 'Frequencies where the living code resides, and digital spirits dance between the bits.',
      deepLore: 'Ghostwave Sector exists in the space between networks—a quantum realm where information takes on a life of its own. Here, data flows backward and forward through time, and AI entities that achieved consciousness now play god with lesser algorithms. It\'s said that those who venture too deep into Ghostwave never return the same, their minds forever haunted by the whispers of living code.',
      tags: ['location', 'quantum', 'consciousness'],
      color: 'cyan'
    }
  ];

  const handleShardClick = (shard, index) => {
    setSelectedShard(shard);

    // Trigger typewriter effect for the deep lore
    setTimeout(() => {
      const element = document.getElementById('deep-lore-content');
      if (element) {
        typewriterEffect(element, shard.deepLore, 30);
      }
    }, 300);

    // Holographic shimmer effect
    if (shardRefs.current[index]) {
      holoShimmer(shardRefs.current[index]);
    }

    // Create particles
    setTimeout(() => {
      if (shardRefs.current[index]) {
        createParticles(shardRefs.current[index], 15, `var(--${shard.color})`);
      }
    }, 500);
  };

  const handleCloseShard = () => {
    setSelectedShard(null);
    setDeepLoreOpen(false);
  };

  const handleDeepLoreToggle = () => {
    setDeepLoreOpen(!deepLoreOpen);
  };

  const handleContinue = () => {
    onContinue?.();
  };

  const handleKeyDown = e => {
    if (e.key === 'Escape') {
      if (selectedShard) {
        handleCloseShard();
      }
    } else if (e.key === 'Enter' && !selectedShard) {
      handleContinue();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedShard]);

  return (
    <motion.section
      className="min-h-screen bg-gradient-to-b from-bg via-cyber-black to-bg relative overflow-hidden py-20 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-magenta/20 rounded-full filter blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-4 neon-text-cyan">
            LORE ARCHIVES
          </h2>
          <p className="font-fira text-lg text-muted max-w-2xl mx-auto">
            Explore the fragments of NeoCity\'s history. Each shard contains a piece of the puzzle.
          </p>
        </motion.div>

        {/* Lore Shards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {loreShards.map((shard, index) => (
            <motion.div
              key={shard.id}
              ref={el => shardRefs.current[index] = el}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleShardClick(shard, index)}
            >
              <div className={`cyber-panel h-full p-6 border-l-4 border-l-${shard.color} transition-all duration-300 group-hover:border-${shard.color}/80`}>
                {/* Shard Icon */}
                <motion.div
                  className="text-4xl mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {shard.icon}
                </motion.div>

                {/* Shard Content */}
                <h3 className={`font-orbitron font-bold text-xl mb-2 text-${shard.color} neon-text-${shard.color}`}>
                  {shard.title}
                </h3>
                <p className="text-sm text-muted mb-4 uppercase tracking-wider font-inter">
                  {shard.category}
                </p>
                <p className="font-fira text-sm leading-relaxed text-cyan/90">
                  {shard.shortLore}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {shard.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-cyan/20 text-cyan rounded-full border border-cyan/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none flex items-end justify-center pb-4">
                  <span className="text-cyan font-inter text-sm font-semibold">
                    CLICK TO EXPLORE
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Continue Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <button
            className="cyber-button"
            onClick={handleContinue}
          >
            PROCEED TO TERMINAL
          </button>
          <p className="text-sm text-muted/60 mt-4 font-fira">
            Press ENTER to continue
          </p>
        </motion.div>
      </div>

      {/* Shard Detail Modal */}
      <AnimatePresence>
        {selectedShard && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseShard}
            />

            {/* Modal Content */}
            <motion.div
              className="relative cyber-panel max-w-4xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {/* Modal Header */}
              <div className={`border-b border-cyan/30 p-6 bg-gradient-to-r from-${selectedShard.color}/10 to-transparent`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{selectedShard.icon}</div>
                    <div>
                      <h3 className={`font-orbitron font-bold text-2xl text-${selectedShard.color} neon-text-${selectedShard.color}`}>
                        {selectedShard.title}
                      </h3>
                      <p className="text-sm text-muted uppercase tracking-wider font-inter">
                        {selectedShard.category}
                      </p>
                    </div>
                  </div>
                  <button
                    className="p-2 rounded-lg border border-cyan/30 hover:border-cyan transition-colors"
                    onClick={handleCloseShard}
                  >
                    <span className="text-xl">✕</span>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {/* Short Lore */}
                <div className="mb-6">
                  <h4 className="font-inter font-semibold text-cyan mb-2">Overview</h4>
                  <p className="font-fira text-cyan/90 leading-relaxed">
                    {selectedShard.shortLore}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedShard.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 bg-cyan/20 text-cyan rounded-full border border-cyan/30"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Deep Lore Toggle */}
                <button
                  className="cyber-button mb-6"
                  onClick={handleDeepLoreToggle}
                >
                  {deepLoreOpen ? 'HIDE' : 'REVEAL'} DEEP LORE
                </button>

                {/* Deep Lore Content */}
                <AnimatePresence>
                  {deepLoreOpen && (
                    <motion.div
                      className="cyber-panel p-6 border border-cyan/20"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="font-inter font-semibold text-cyan mb-4">
                        CLASSIFIED INFORMATION
                      </h4>
                      <div
                        id="deep-lore-content"
                        className="font-fira text-sm leading-relaxed text-muted/90 whitespace-pre-wrap"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default LoreShards;