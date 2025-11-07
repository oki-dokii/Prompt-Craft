/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b0c10',
        cyan: '#00f0ff',
        magenta: '#ff2dd4',
        violet: '#7b3cff',
        holo: '#ffd24d',
        muted: '#9aa0a6',
        'cyber-black': '#0a0a0f',
        'neon-green': '#39ff14',
        'electric-blue': '#0099ff',
        'plasma-pink': '#ff006e'
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'fira': ['Fira Code', 'monospace'],
        'inter': ['Inter', 'sans-serif']
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 3s ease-in-out infinite',
        'rgb-shift': 'rgbShift 2s ease-in-out infinite',
        'vhs-jitter': 'vhsJitter 0.1s ease-in-out infinite',
        'terminal-cursor': 'terminalCursor 1s ease-in-out infinite'
      },
      keyframes: {
        glowPulse: {
          '0%': { filter: 'brightness(1) contrast(1)' },
          '100%': { filter: 'brightness(1.2) contrast(1.1)' }
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 }
        },
        rgbShift: {
          '0%, 100%': { textShadow: '2px 0 #ff2dd4, -2px 0 #00f0ff' },
          '50%': { textShadow: '-2px 0 #ff2dd4, 2px 0 #00f0ff' }
        },
        vhsJitter: {
          '0%, 100%': { transform: 'translate(0)' },
          '25%': { transform: 'translate(-1px, 1px)' },
          '50%': { transform: 'translate(1px, -1px)' },
          '75%': { transform: 'translate(-1px, -1px)' }
        },
        terminalCursor: {
          '0%, 50%': { opacity: 1 },
          '51%, 100%': { opacity: 0 }
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 20px #00f0ff, 0 0 40px #00f0ff, 0 0 60px #00f0ff',
        'neon-magenta': '0 0 20px #ff2dd4, 0 0 40px #ff2dd4, 0 0 60px #ff2dd4',
        'neon-violet': '0 0 20px #7b3cff, 0 0 40px #7b3cff, 0 0 60px #7b3cff',
        'holo-glow': '0 0 15px #ffd24d, 0 0 30px #ffd24d',
        'text-glow': '0 0 10px currentColor, 0 0 20px currentColor'
      },
      backdropBlur: {
        'cyber': '8px'
      }
    },
  },
  plugins: [],
}