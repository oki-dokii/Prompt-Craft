// Visual effects utilities for cyberpunk UI

/**
 * Triggers a glitch effect on an element
 */
export const triggerGlitch = (element: HTMLElement, duration: number = 300) => {
  element.classList.add('vhs-jitter');

  // Add RGB split effect
  const text = element.textContent || '';
  element.setAttribute('data-text', text);
  element.classList.add('rgb-split');

  setTimeout(() => {
    element.classList.remove('vhs-jitter', 'rgb-split');
    element.removeAttribute('data-text');
  }, duration);
};

/**
 * Creates scanline effect overlay
 */
export const createScanlineOverlay = (): HTMLElement => {
  const overlay = document.createElement('div');
  overlay.className = 'crt-overlay';
  return overlay;
};

/**
 * Creates film grain overlay
 */
export const createGrainOverlay = (): HTMLElement => {
  const overlay = document.createElement('div');
  overlay.className = 'grain-overlay';
  return overlay;
};

/**
 * Adds neon glow pulse to element
 */
export const addNeonGlow = (element: HTMLElement, color: 'cyan' | 'magenta' | 'violet' | 'holo' = 'cyan') => {
  element.classList.add(`neon-text-${color}`);
};

/**
 * Removes all glow effects from element
 */
export const removeGlow = (element: HTMLElement) => {
  element.classList.remove('neon-text', 'neon-text-cyan', 'neon-text-magenta', 'neon-text-violet', 'holo-text');
};

/**
 * Triggers a typewriter effect on text content
 */
export const typewriterEffect = (
  element: HTMLElement,
  text: string,
  speed: number = 50,
  onComplete?: () => void
): Promise<void> => {
  return new Promise((resolve) => {
    element.textContent = '';
    let index = 0;

    const typeChar = () => {
      if (index < text.length) {
        element.textContent += text[index];
        index++;
        setTimeout(typeChar, speed);
      } else {
        onComplete?.();
        resolve();
      }
    };

    typeChar();
  });
};

/**
 * Creates floating particle effect
 */
export const createParticles = (
  container: HTMLElement,
  count: number = 20,
  color: string = '#00f0ff'
): void => {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.boxShadow = `0 0 6px ${color}`;

    // Random starting position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';

    // Animation
    const duration = 2000 + Math.random() * 3000;
    const delay = Math.random() * 500;

    particle.style.animation = `floatUp ${duration}ms ${delay}ms ease-out forwards`;

    container.appendChild(particle);

    // Remove after animation
    setTimeout(() => {
      particle.remove();
    }, duration + delay);
  }
};

/**
 * Holographic shimmer effect
 */
export const holoShimmer = (element: HTMLElement): void => {
  element.style.animation = 'holo-shimmer 2s ease-in-out infinite';

  // Add custom keyframes if not already in DOM
  if (!document.querySelector('#holo-shimmer-styles')) {
    const style = document.createElement('style');
    style.id = 'holo-shimmer-styles';
    style.textContent = `
      @keyframes holo-shimmer {
        0% {
          background-position: -200% 0;
          filter: hue-rotate(0deg);
        }
        50% {
          background-position: 200% 0;
          filter: hue-rotate(30deg);
        }
        100% {
          background-position: -200% 0;
          filter: hue-rotate(0deg);
        }
      }
    `;
    document.head.appendChild(style);
  }
};

/**
 * Digital rain effect (Matrix-style)
 */
export const createDigitalRain = (
  container: HTMLElement,
  duration: number = 5000
): void => {
  const characters = '01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';

  for (let i = 0; i < 15; i++) {
    const column = document.createElement('div');
    column.style.position = 'absolute';
    column.style.left = Math.random() * 100 + '%';
    column.style.top = '-100px';
    column.style.fontFamily = 'Fira Code, monospace';
    column.style.fontSize = '14px';
    column.style.color = '#00f0ff';
    column.style.textShadow = '0 0 5px #00f0ff';
    column.style.pointerEvents = 'none';
    column.style.whiteSpace = 'nowrap';
    column.style.animation = `digitalRain ${duration}ms linear infinite`;
    column.style.animationDelay = Math.random() * duration + 'ms';

    // Random characters
    let text = '';
    for (let j = 0; j < 20; j++) {
      text += characters[Math.floor(Math.random() * characters.length)] + '<br>';
    }
    column.innerHTML = text;

    container.appendChild(column);
  }

  // Add animation keyframes
  if (!document.querySelector('#digital-rain-styles')) {
    const style = document.createElement('style');
    style.id = 'digital-rain-styles';
    style.textContent = `
      @keyframes digitalRain {
        0% {
          transform: translateY(-100vh);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(100vh);
          opacity: 0;
        }
      }

      @keyframes floatUp {
        0% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        100% {
          transform: translateY(-100px) scale(0);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

/**
 * Error shake animation
 */
export const shakeElement = (element: HTMLElement, intensity: number = 5): void => {
  element.style.animation = `shake ${0.3}s ease-in-out`;

  // Add shake keyframes if not present
  if (!document.querySelector('#shake-styles')) {
    const style = document.createElement('style');
    style.id = 'shake-styles';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-${intensity}px); }
        20%, 40%, 60%, 80% { transform: translateX(${intensity}px); }
      }
    `;
    document.head.appendChild(style);
  }

  // Remove animation after completion
  setTimeout(() => {
    element.style.animation = '';
  }, 300);
};

/**
 * Success pulse animation
 */
export const successPulse = (element: HTMLElement, color: string = '#00f0ff'): void => {
  element.style.animation = 'successPulse 0.6s ease-out';
  element.style.boxShadow = `0 0 20px ${color}`;

  // Add keyframes if not present
  if (!document.querySelector('#success-pulse-styles')) {
    const style = document.createElement('style');
    style.id = 'success-pulse-styles';
    style.textContent = `
      @keyframes successPulse {
        0% {
          transform: scale(1);
          filter: brightness(1);
        }
        50% {
          transform: scale(1.05);
          filter: brightness(1.3);
        }
        100% {
          transform: scale(1);
          filter: brightness(1);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Remove effects after animation
  setTimeout(() => {
    element.style.animation = '';
    element.style.boxShadow = '';
  }, 600);
};

/**
 * Initialize global effects overlays
 */
export const initializeEffects = (): void => {
  const body = document.body;

  // Add scanlines and grain overlays
  if (!body.querySelector('.crt-overlay')) {
    body.appendChild(createScanlineOverlay());
  }

  if (!body.querySelector('.grain-overlay')) {
    body.appendChild(createGrainOverlay());
  }

  // Add global styles for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    body.style.setProperty('--animation-duration', '0.01ms');
  }
};

/**
 * Clean up effects
 */
export const cleanupEffects = (): void => {
  const overlays = document.querySelectorAll('.crt-overlay, .grain-overlay');
  overlays.forEach(overlay => overlay.remove());

  const dynamicStyles = document.querySelectorAll(
    '[id$="-styles"]:not([data-static])'
  );
  dynamicStyles.forEach(style => style.remove());
};