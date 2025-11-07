// Scoring algorithm for the Hacking Terminal mini-game

export interface RoundMetrics {
  round: number;
  sequence: string;
  timeToFirstKey: number; // milliseconds
  timeToFinish: number; // milliseconds
  errors: number; // incorrect keystrokes
  backspaces: number; // correction actions
  accuracy: number; // percentage (0-100)
  finishedOnTime: boolean;
  timeBonus: number;
  efficiency: number; // 0-100 based on steady pace
}

export interface GameScore {
  totalScore: number; // 0-100
  roundScores: number[]; // 0-100 per round
  averageAccuracy: number;
  averageSpeed: number; // chars per second
  totalErrors: number;
  totalTime: number; // milliseconds
  role: string;
  roleDescription: string;
  metrics: RoundMetrics[];
}

// Role thresholds and descriptions
export const ROLES = {
  'Tech Runner': {
    threshold: 90,
    description: 'You cut firewall silk without waking its spiders.',
    color: 'cyan',
    icon: '⚡'
  },
  'Data Ghost': {
    threshold: 75,
    description: 'You left no ripples in the stream.',
    color: 'magenta',
    icon: '👻'
  },
  'Infiltrator': {
    threshold: 60,
    description: 'Between neon and shadow, you walk the seam.',
    color: 'violet',
    icon: '🥷'
  },
  'Shadow Courier': {
    threshold: 40,
    description: 'Speed over silence. The drop arrives anyway.',
    color: 'holo',
    icon: '📦'
  },
  'Cyber Bruiser': {
    threshold: 0,
    description: 'When the net resists, you make it remember.',
    color: 'muted',
    icon: '💥'
  }
} as const;

/**
 * Calculate round score based on multiple factors
 */
export const calculateRoundScore = (metrics: RoundMetrics): number => {
  const { accuracy, timeToFinish, errors, finishedOnTime, timeBonus, efficiency } = metrics;

  // Base scoring components
  const accuracyScore = accuracy; // 0-100
  const speedScore = calculateSpeedScore(metrics); // 0-100
  const finishScore = finishedOnTime ? 100 : 50; // 100 for on-time, 50 for late
  const efficiencyScore = efficiency; // 0-100

  // Weighted average
  const roundScore = (
    accuracyScore * 0.4 +     // 40% accuracy
    speedScore * 0.4 +        // 40% speed
    finishScore * 0.1 +       // 10% completion
    efficiencyScore * 0.1     // 10% efficiency
  );

  // Apply time bonus
  const finalScore = Math.min(100, roundScore + timeBonus);

  return Math.max(0, finalScore);
};

/**
 * Calculate speed score based on characters per second
 */
const calculateSpeedScore = (metrics: RoundMetrics): number => {
  const { timeToFinish, sequence, round } = metrics;
  const charCount = sequence.replace(/\s+/g, '').length; // Remove spaces
  const timeInSeconds = timeToFinish / 1000;

  if (timeInSeconds === 0) return 0;

  const charsPerSecond = charCount / timeInSeconds;

  // Speed targets based on round difficulty (higher rounds = harder = need faster speed)
  const speedTargets = {
    1: 2.0,  // 2 chars/sec minimum for round 1
    2: 2.5,  // 2.5 chars/sec for round 2
    3: 3.0,  // 3 chars/sec for round 3
    4: 3.5,  // 3.5 chars/sec for round 4
    5: 4.0   // 4 chars/sec for round 5
  };

  const targetSpeed = speedTargets[Math.min(round, 5)] || 4.0;
  const speedRatio = charsPerSecond / targetSpeed;

  // Convert to 0-100 scale with diminishing returns
  if (speedRatio >= 2) return 100; // 2x target speed = max score
  if (speedRatio >= 1.5) return 90; // 1.5x = 90
  if (speedRatio >= 1.0) return 80; // Target speed = 80
  if (speedRatio >= 0.8) return 60; // 80% of target = 60
  if (speedRatio >= 0.6) return 40; // 60% of target = 40
  if (speedRatio >= 0.4) return 20; // 40% of target = 20
  return Math.max(0, speedRatio * 50); // Linear scaling for very slow speeds
};

/**
 * Calculate efficiency score based on pacing and corrections
 */
export const calculateEfficiency = (metrics: RoundMetrics): number => {
  const { backspaces, timeToFirstKey, sequence } = metrics;
  const charCount = sequence.replace(/\s+/g, '').length;

  // Base efficiency starts at 100
  let efficiency = 100;

  // Penalty for backspaces (shows uncertainty)
  const backspacePenalty = Math.min(50, backspaces * 5); // 5 points per backspace, max 50
  efficiency -= backspacePenalty;

  // Penalty for slow start
  if (timeToFirstKey > 2000) { // More than 2 seconds
    efficiency -= Math.min(20, (timeToFirstKey - 2000) / 100); // 1 point per 100ms over 2s
  }

  // Bonus for very fast start
  if (timeToFirstKey < 500) { // Less than 0.5 seconds
    efficiency += Math.min(10, (500 - timeToFirstKey) / 50); // 1 point per 50ms under 0.5s
  }

  // Penalty for very slow overall pace
  const avgTimePerChar = timeToFirstKey / charCount;
  if (avgTimePerChar > 500) { // More than 0.5 seconds per character
    efficiency -= Math.min(20, (avgTimePerChar - 500) / 25);
  }

  return Math.max(0, Math.min(100, efficiency));
};

/**
 * Calculate time bonus for early completion
 */
export const calculateTimeBonus = (metrics: RoundMetrics): number => {
  const { timeToFinish, round, finishedOnTime } = metrics;

  if (!finishedOnTime) return 0;

  // Get round time limit
  const timeLimits = {
    1: 12000, // 12 seconds
    2: 10000, // 10 seconds
    3: 8000,  // 8 seconds
    4: 7000,  // 7 seconds
    5: 6000   // 6 seconds
  };

  const timeLimit = timeLimits[Math.min(round, 5)] || 6000;
  const timeRemaining = timeLimit - timeToFinish;

  if (timeRemaining <= 0) return 0;

  // Bonus based on percentage of time saved
  const timeSavedRatio = timeRemaining / timeLimit;

  if (timeSavedRatio >= 0.5) return 10; // Saved 50%+ of time = 10 points
  if (timeSavedRatio >= 0.25) return 5;  // Saved 25%+ of time = 5 points
  if (timeSavedRatio >= 0.1) return 2;   // Saved 10%+ of time = 2 points
  return 0;
};

/**
 * Calculate penalties for various negative factors
 */
export const calculatePenalties = (allMetrics: RoundMetrics[]): number => {
  let totalPenalties = 0;

  // Penalty for total errors across all rounds
  const totalErrors = allMetrics.reduce((sum, m) => sum + m.errors, 0);
  totalPenalties += Math.min(12, 0.5 * totalErrors);

  // Penalty for window focus loss (if tracked)
  // This would be set from the game component when focus is lost
  // totalPenalties += 2; // Uncomment if focus loss occurred

  // Penalty for inconsistent performance (high variance in scores)
  if (allMetrics.length > 1) {
    const scores = allMetrics.map(m => calculateRoundScore(m));
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev > 30) { // High variance in performance
      totalPenalties += 5;
    }
  }

  return totalPenalties;
};

/**
 * Calculate bonuses for exceptional performance
 */
export const calculateBonuses = (allMetrics: RoundMetrics[]): number => {
  let totalBonuses = 0;

  // Bonus for consistently fast reaction times
  const avgReactionTime = allMetrics.reduce((sum, m) => sum + m.timeToFirstKey, 0) / allMetrics.length;
  if (avgReactionTime < 800) { // Less than 800ms average reaction time
    totalBonuses += 3;
  }

  // Bonus for perfect rounds (100% accuracy, no errors)
  const perfectRounds = allMetrics.filter(m => m.accuracy === 100 && m.errors === 0).length;
  totalBonuses += perfectRounds * 2; // 2 points per perfect round

  // Bonus for consistency (all rounds completed on time)
  const allOnTime = allMetrics.every(m => m.finishedOnTime);
  if (allOnTime && allMetrics.length > 0) {
    totalBonuses += 5;
  }

  return totalBonuses;
};

/**
 * Calculate final game score and determine role
 */
export const calculateFinalScore = (allMetrics: RoundMetrics[]): GameScore => {
  if (allMetrics.length === 0) {
    return {
      totalScore: 0,
      roundScores: [],
      averageAccuracy: 0,
      averageSpeed: 0,
      totalErrors: 0,
      totalTime: 0,
      role: 'Cyber Bruiser',
      roleDescription: ROLES['Cyber Bruiser'].description,
      metrics: []
    };
  }

  // Calculate individual round scores
  const roundScores = allMetrics.map(metrics => calculateRoundScore(metrics));

  // Calculate average round score
  const averageRoundScore = roundScores.reduce((a, b) => a + b, 0) / roundScores.length;

  // Calculate penalties and bonuses
  const penalties = calculatePenalties(allMetrics);
  const bonuses = calculateBonuses(allMetrics);

  // Final score calculation
  const totalScore = Math.max(0, Math.min(100, averageRoundScore - penalties + bonuses));

  // Calculate other metrics
  const averageAccuracy = allMetrics.reduce((sum, m) => sum + m.accuracy, 0) / allMetrics.length;
  const totalChars = allMetrics.reduce((sum, m) => sum + m.sequence.replace(/\s+/g, '').length, 0);
  const totalTime = allMetrics.reduce((sum, m) => sum + m.timeToFinish, 0);
  const averageSpeed = totalTime > 0 ? (totalChars / (totalTime / 1000)) : 0;
  const totalErrors = allMetrics.reduce((sum, m) => sum + m.errors, 0);

  // Determine role based on score
  const role = getRoleFromScore(totalScore);

  return {
    totalScore: Math.round(totalScore * 10) / 10, // Round to 1 decimal place
    roundScores: roundScores.map(score => Math.round(score * 10) / 10),
    averageAccuracy: Math.round(averageAccuracy * 10) / 10,
    averageSpeed: Math.round(averageSpeed * 10) / 10,
    totalErrors,
    totalTime,
    role: role.name,
    roleDescription: role.description,
    metrics: allMetrics
  };
};

/**
 * Determine role based on final score
 */
export const getRoleFromScore = (score: number): typeof ROLES[keyof typeof ROLES] => {
  // Find the highest threshold that the score meets
  const sortedRoles = Object.entries(ROLES).sort((a, b) => b[1].threshold - a[1].threshold);

  for (const [roleName, roleData] of sortedRoles) {
    if (score >= roleData.threshold) {
      return {
        name: roleName,
        ...roleData
      };
    }
  }

  // Fallback to lowest role
  return {
    name: 'Cyber Bruiser',
    ...ROLES['Cyber Bruiser']
  };
};

/**
 * Get role information by name
 */
export const getRoleInfo = (roleName: string): typeof ROLES[keyof typeof ROLES] | null => {
  return ROLES[roleName as keyof typeof ROLES] || null;
};

/**
 * Calculate grade letter for score (A-F)
 */
export const getGradeLetter = (score: number): string => {
  if (score >= 95) return 'S';
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'C+';
  if (score >= 65) return 'C';
  if (score >= 60) return 'D+';
  if (score >= 55) return 'D';
  if (score >= 50) return 'D-';
  return 'F';
};

/**
 * Format time for display
 */
export const formatTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const ms = milliseconds % 1000;

  if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${Math.floor(ms / 100)}`;
  }

  return `${seconds}.${Math.floor(ms / 100)}s`;
};

/**
 * Generate performance summary text
 */
export const generatePerformanceSummary = (score: GameScore): string[] => {
  const summaries: string[] = [];

  // Overall performance
  if (score.totalScore >= 90) {
    summaries.push("Exceptional performance! You're a natural hacker.");
  } else if (score.totalScore >= 75) {
    summaries.push("Impressive skills. You have what it takes.");
  } else if (score.totalScore >= 60) {
    summaries.push("Solid performance. Room for improvement.");
  } else if (score.totalScore >= 40) {
    summaries.push("Keep practicing. You'll get there.");
  } else {
    summaries.push("Everyone starts somewhere. Try again!");
  }

  // Speed feedback
  if (score.averageSpeed >= 4) {
    summaries.push("Lightning-fast typing speed!");
  } else if (score.averageSpeed >= 3) {
    summaries.push("Good typing pace.");
  } else if (score.averageSpeed < 2) {
    summaries.push("Focus on improving your typing speed.");
  }

  // Accuracy feedback
  if (score.averageAccuracy >= 95) {
    summaries.push("Nearly perfect accuracy!");
  } else if (score.averageAccuracy >= 85) {
    summaries.push("Great accuracy.");
  } else if (score.averageAccuracy < 70) {
    summaries.push("Work on your accuracy for better scores.");
  }

  // Error feedback
  if (score.totalErrors === 0) {
    summaries.push("Flawless execution - zero errors!");
  } else if (score.totalErrors <= 3) {
    summaries.push("Very few mistakes - well done.");
  } else if (score.totalErrors > 10) {
    summaries.push("Too many errors affected your score.");
  }

  return summaries;
};