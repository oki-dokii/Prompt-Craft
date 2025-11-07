// Sequence generation algorithms for the Hacking Terminal mini-game

export interface Sequence {
  id: string;
  type: 'hexburst' | 'glyphcmd' | 'patternpulse';
  text: string;
  difficulty: number; // 1-5 scale
  round: number;
}

export interface GameConfig {
  totalRounds: number;
  difficulty: 'easy' | 'standard' | 'hard';
}

// Difficulty settings based on game configuration
const DIFFICULTY_SETTINGS = {
  easy: {
    hexBurstLength: { min: 6, max: 8 },
    glyphCmdComplexity: 'simple',
    patternPulseLength: { min: 8, max: 12 },
    timeBonuses: { multiplier: 1.5 }
  },
  standard: {
    hexBurstLength: { min: 8, max: 10 },
    glyphCmdComplexity: 'medium',
    patternPulseLength: { min: 12, max: 16 },
    timeBonuses: { multiplier: 1.0 }
  },
  hard: {
    hexBurstLength: { min: 10, max: 14 },
    glyphCmdComplexity: 'complex',
    patternPulseLength: { min: 16, max: 24 },
    timeBonuses: { multiplier: 0.8 }
  }
};

// Hex character set for HexBurst sequences
const HEX_CHARS = '0123456789ABCDEF';

// Command templates for GlyphCmd sequences
const GLYPH_COMMANDS = {
  simple: {
    commands: ['ghostwave', 'neurolink', 'cyberlink', 'datastream', 'neuralink'],
    flags: ['--sync', '--tap', '--run', '--init', '--connect'],
    values: ['-r 1', '-f 0', '-s on', '-v 1', '-p active']
  },
  medium: {
    commands: ['quantumbridge', 'neuralnet', 'cybernexus', 'datapipe', 'ghostprotocol'],
    flags: ['--encrypt', '--bypass', '--override', '--inject', '--extract'],
    values: ['-level 3', '-auth admin', '-port 443', '-key quantum', '-hash md5']
  },
  complex: {
    commands: ['quantumentanglement', 'neuromatrix', 'cyberframework', 'ghostalgorithm', 'sentience'],
    flags: ['--synchronize', '--initialize', '--terminate', '--escalate', '--deconstruct'],
    values: ['-priority critical', '-clearance omega', '-protocol secure', '-vector injection', '-payload encrypted']
  }
};

// Pattern groups for PatternPulse sequences
const PATTERN_GROUPS = {
  simple: ['CA', '7F', '1A', 'FF', '00', 'B8'],
  medium: ['CA', '7F', '1A', 'FF', '00', 'B8', '3D', 'E6', '4C', '99'],
  complex: ['CA', '7F', '1A', 'FF', '00', 'B8', '3D', 'E6', '4C', '99', 'A5', '5A', 'F0', '0F', 'C3', '3C']
};

/**
 * Generate a random HexBurst sequence
 */
export const generateHexBurst = (round: number, config: GameConfig): Sequence => {
  const settings = DIFFICULTY_SETTINGS[config.difficulty];
  const roundModifier = Math.min(round, 5); // Cap difficulty scaling at round 5

  const baseLength = settings.hexBurstLength.min + Math.floor(Math.random() * (settings.hexBurstLength.max - settings.hexBurstLength.min));
  const length = baseLength + Math.floor(roundModifier / 2); // Increase length with rounds

  let hexString = '0x';
  for (let i = 0; i < length; i++) {
    hexString += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
  }

  return {
    id: `hexburst-${Date.now()}-${Math.random()}`,
    type: 'hexburst',
    text: hexString,
    difficulty: Math.min(5, 1 + roundModifier),
    round
  };
};

/**
 * Generate a random GlyphCmd sequence
 */
export const generateGlyphCmd = (round: number, config: GameConfig): Sequence => {
  const settings = DIFFICULTY_SETTINGS[config.difficulty];
  const commandSet = GLYPH_COMMANDS[settings.glyphCmdComplexity];
  const roundModifier = Math.min(round, 5);

  // Select random components
  const command = commandSet.commands[Math.floor(Math.random() * commandSet.commands.length)];
  const flag = commandSet.flags[Math.floor(Math.random() * commandSet.flags.length)];
  const value = commandSet.values[Math.floor(Math.random() * commandSet.values.length)];

  // Build sequence with optional complexity based on round
  let sequence = `${command} ${flag} ${value}`;

  // Add additional complexity for higher rounds
  if (roundModifier >= 3 && Math.random() > 0.5) {
    const extraFlag = commandSet.flags[Math.floor(Math.random() * commandSet.flags.length)];
    const extraValue = commandSet.values[Math.floor(Math.random() * commandSet.values.length)];
    sequence += ` ${extraFlag} ${extraValue}`;
  }

  return {
    id: `glyphcmd-${Date.now()}-${Math.random()}`,
    type: 'glyphcmd',
    text: sequence,
    difficulty: Math.min(5, 1 + roundModifier),
    round
  };
};

/**
 * Generate a random PatternPulse sequence
 */
export const generatePatternPulse = (round: number, config: GameConfig): Sequence => {
  const settings = DIFFICULTY_SETTINGS[config.difficulty];
  const roundModifier = Math.min(round, 5);

  // Choose pattern complexity based on available groups
  const availableGroups = settings.glyphCmdComplexity === 'simple'
    ? PATTERN_GROUPS.simple
    : settings.glyphCmdComplexity === 'medium'
    ? PATTERN_GROUPS.medium
    : PATTERN_GROUPS.complex;

  // Base pattern length
  const baseLength = settings.patternPulseLength.min + Math.floor(Math.random() * (settings.patternPulseLength.max - settings.patternPulseLength.min));
  const patternLength = baseLength + Math.floor(roundModifier * 2);

  // Generate alternating pattern
  const pattern = [];
  const groupA = availableGroups[Math.floor(Math.random() * availableGroups.length)];
  const groupB = availableGroups[Math.floor(Math.random() * availableGroups.length)];

  for (let i = 0; i < patternLength; i++) {
    pattern.push(i % 2 === 0 ? groupA : groupB);
  }

  const sequence = pattern.join('-');

  return {
    id: `patternpulse-${Date.now()}-${Math.random()}`,
    type: 'patternpulse',
    text: sequence,
    difficulty: Math.min(5, 1 + roundModifier),
    round
  };
};

/**
 * Generate a sequence of the specified type
 */
export const generateSequence = (type: Sequence['type'], round: number, config: GameConfig): Sequence => {
  switch (type) {
    case 'hexburst':
      return generateHexBurst(round, config);
    case 'glyphcmd':
      return generateGlyphCmd(round, config);
    case 'patternpulse':
      return generatePatternPulse(round, config);
    default:
      return generateHexBurst(round, config); // Fallback
  }
};

/**
 * Generate a random sequence type for a given round
 */
export const generateRandomSequence = (round: number, config: GameConfig): Sequence => {
  const types: Sequence['type'][] = ['hexburst', 'glyphcmd', 'patternpulse'];
  const weights = [0.4, 0.35, 0.25]; // Weight probabilities (HexBurst most common)

  // Adjust weights based on round
  const roundModifier = Math.min(round, 5);
  if (roundModifier >= 3) {
    weights[1] += 0.1; // More GlyphCmd in later rounds
    weights[2] += 0.05; // Slightly more PatternPulse
  }

  // Weighted random selection
  const random = Math.random();
  let cumulative = 0;
  let selectedType = types[0];

  for (let i = 0; i < types.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      selectedType = types[i];
      break;
    }
  }

  return generateSequence(selectedType, round, config);
};

/**
 * Generate a complete set of sequences for a game
 */
export const generateGameSequences = (config: GameConfig): Sequence[] => {
  const sequences: Sequence[] = [];

  for (let round = 1; round <= config.totalRounds; round++) {
    const sequence = generateRandomSequence(round, config);
    sequences.push(sequence);
  }

  return sequences;
};

/**
 * Calculate round time limits based on difficulty and round
 */
export const getRoundTimeLimit = (round: number, config: GameConfig): number => {
  const settings = DIFFICULTY_SETTINGS[config.difficulty];

  // Base time limits (in seconds)
  const baseTimes = {
    1: 12,
    2: 10,
    3: 8,
    4: 7,
    5: 6
  };

  const baseTime = baseTimes[Math.min(round, 5)] || 6;
  return Math.floor(baseTime * settings.timeBonuses.multiplier);
};

/**
 * Validate sequence input against target
 */
export const validateSequenceInput = (input: string, target: string): {
  isCorrect: boolean;
  isComplete: boolean;
  correctChars: number;
  totalChars: number;
  errors: string[];
} => {
  const errors: string[] = [];
  let correctChars = 0;

  // Remove any whitespace for comparison
  const cleanInput = input.replace(/\s+/g, '');
  const cleanTarget = target.replace(/\s+/g, '');

  for (let i = 0; i < cleanInput.length; i++) {
    if (i < cleanTarget.length) {
      if (cleanInput[i].toUpperCase() === cleanTarget[i].toUpperCase()) {
        correctChars++;
      } else {
        errors.push(`Position ${i + 1}: expected '${cleanTarget[i]}', got '${cleanInput[i]}'`);
      }
    } else {
      errors.push(`Extra character at position ${i + 1}: '${cleanInput[i]}'`);
    }
  }

  const isCorrect = errors.length === 0 && cleanInput.length === cleanTarget.length;
  const isComplete = cleanInput.length >= cleanTarget.length;

  return {
    isCorrect,
    isComplete,
    correctChars,
    totalChars: cleanTarget.length,
    errors
  };
};

/**
 * Get display class for character feedback
 */
export const getCharDisplayClass = (index: number, input: string, target: string): string => {
  if (index >= input.length) {
    return 'char-untyped';
  }

  const inputChar = input[index].toUpperCase();
  const targetChar = target[index].toUpperCase();

  if (inputChar === targetChar) {
    return 'char-correct';
  } else {
    return 'char-incorrect';
  }
};

/**
 * Get sequence type display information
 */
export const getSequenceTypeInfo = (type: Sequence['type']) => {
  switch (type) {
    case 'hexburst':
      return {
        name: 'HexBurst',
        description: 'Hexadecimal memory address',
        icon: '🔢',
        color: 'cyan'
      };
    case 'glyphcmd':
      return {
        name: 'GlyphCmd',
        description: 'System command execution',
        icon: '⌨️',
        color: 'magenta'
      };
    case 'patternpulse':
      return {
        name: 'PatternPulse',
        description: 'Alternating data pattern',
        icon: '〰️',
        color: 'violet'
      };
    default:
      return {
        name: 'Unknown',
        description: 'Unknown sequence type',
        icon: '❓',
        color: 'muted'
      };
  }
};