# NEOCITY // GHOSTWAVE

A fictional, cyberpunk-themed recruitment portal featuring an immersive hacking terminal mini-game that assigns roles based on performance.

## 🌆 Overview

**NeoCity Ghostwave** is an interactive, single-page application that creates a cyberpunk recruitment experience. Users navigate through four distinct sections, culminating in a hacking challenge that determines their fictional role in the Ghostwave collective.

### Key Features

- **Immersive Cyberpunk Aesthetic**: Neon glow effects, CRT scanlines, glitch animations, and holographic elements
- **Hacking Terminal Mini-Game**: Sequence-based typing challenges with real-time feedback and scoring
- **Dynamic Role Assignment**: 5-tier role system based on performance (Tech Runner, Data Ghost, Infiltrator, Shadow Courier, Cyber Bruiser)
- **Fully Responsive**: Optimized for desktop and mobile devices
- **Accessibility First**: Keyboard navigation, screen reader support, reduced motion preferences
- **Static Deployment**: No backend required - runs entirely in the browser

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Prompt-Craft
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for static deployment.

## 🎮 Game Flow

### 1. Access Gate
- Cyberpunk-themed landing screen with "BREACH" animation
- Interactive gate opening sequence with RGB split effects

### 2. Lore Archives
- Interactive holographic shards containing NeoCity lore
- Expandable content with parallax effects
- 5 unique lore fragments exploring the world

### 3. Terminal Game
- **3 rounds** (configurable to 5) of escalating difficulty
- **3 sequence types**:
  - **HexBurst**: Hexadecimal memory addresses (`0x3FA9C2`)
  - **GlyphCmd**: System commands (`ghostwave --tap -r 3`)
  - **PatternPulse**: Alternating data patterns (`CA-7F-CA-7F-1A`)
- Real-time character validation with color feedback
- Adaptive scoring based on accuracy, speed, and efficiency

### 4. Role Reveal
- Dramatic 3D role reveal with particle effects
- Performance metrics and detailed scoring breakdown
- Share functionality for social media

## ⚙️ Configuration

### Game Settings

- **Rounds**: 3 or 5 rounds
- **Difficulty**: Easy, Standard, or Hard
- **Sound**: Toggle sound effects on/off
- **Visual Mode**: Low FX, Standard, or High FX

### Accessibility Features

- **Keyboard Navigation**: Complete keyboard-only control
- **Screen Reader**: Full ARIA support and live announcements
- **Reduced Motion**: Respects OS preferences
- **High Contrast**: WCAG AA compliant color schemes
- **Focus Management**: Proper focus handling throughout

## 🎨 Design System

### Color Palette
```css
--bg: #0b0c10          /* Primary background */
--cyan: #00f0ff        /* Primary accent */
--magenta: #ff2dd4     /* Secondary accent */
--violet: #7b3cff      /* Tertiary accent */
--holo: #ffd24d        /* Highlight color */
--muted: #9aa0a6       /* Text secondary */
```

### Typography
- **Titles**: Orbitron (cyberpunk aesthetic)
- **Terminal**: Fira Code (monospace)
- **UI Elements**: Inter (clean sans-serif)

### Visual Effects
- CRT scanlines overlay
- Neon glow with text-shadow
- RGB split transitions
- Glitch animations
- Holographic shimmer
- Film grain texture

## 🏗️ Technical Architecture

### Technology Stack
- **Framework**: React 18+ with hooks
- **Build Tool**: Vite (fast development & optimized builds)
- **Styling**: Tailwind CSS with custom utilities
- **Animations**: Framer Motion
- **Deployment**: Static hosting compatible

### Project Structure
```
src/
├── components/          # React components
│   ├── AccessGate.jsx
│   ├── LoreShards.jsx
│   ├── TerminalGame.jsx
│   ├── RoleReveal.jsx
│   ├── HeaderHud.jsx
│   └── SettingsDrawer.jsx
├── lib/                # Core logic
│   ├── sequences.ts    # Sequence generation
│   ├── scoring.ts      # Scoring algorithms
│   └── fx.ts          # Visual effects
├── styles/
│   └── theme.css       # CSS variables and utilities
├── App.jsx             # Main application
└── main.jsx            # Entry point
```

### Core Algorithms

#### Sequence Generation
- **HexBurst**: Random hex strings with length scaling
- **GlyphCmd**: Weighted command/flag/value combinations
- **PatternPulse**: Alternating group patterns

#### Scoring Formula
```
roundScore = 40*(accuracy%) + 40*(speedNorm) + 10*(finishFlag) + 10*(efficiency)
finalScore = average(roundScores) - penalties + bonuses
```

## 🚢 Deployment

### Static Hosting

The application is optimized for static hosting and works with:

- **GitHub Pages** (free)
- **Vercel** (free tier)
- **Netlify** (free tier)
- **Firebase Hosting** (free tier)
- **Any static web server**

### Environment Setup

No environment variables required - the application runs entirely client-side.

### Build Optimization

- **Bundle Splitting**: Vendor and motion code separated
- **Asset Optimization**: Images and fonts optimized
- **Tree Shaking**: Unused code eliminated
- **Compression**: Gzip/Brotli ready

## 🧪 Testing

### Manual Testing Checklist

1. **Visual Polish**
   - [ ] All effects render correctly
   - [ ] Animations are smooth (60fps)
   - [ ] No visual artifacts or broken layouts

2. **Game Logic**
   - [ ] Sequences generate properly
   - [ ] Scoring is accurate
   - [ ] Timer functionality works
   - [ ] All sequence types function

3. **User Flow**
   - [ ] Complete journey from Access to Role Reveal
   - [ ] Navigation works correctly
   - [ ] Settings persist properly
   - [ ] Restart functionality works

4. **Accessibility**
   - [ ] Keyboard navigation works throughout
   - [ ] Screen reader announcements are clear
   - [ ] Reduced motion mode functions
   - [ ] Color contrast meets WCAG AA

5. **Responsive Design**
   - [ ] Functions on mobile devices (320px+)
   - [ ] Tablet layout works correctly (768px+)
   - [ ] Desktop experience is optimal (1024px+)
   - [ ] Touch interactions work properly

6. **Performance**
   - [ ] Initial load under 2 seconds
   - [ ] Smooth 60fps animations
   - [ ] No blocking scripts >200KB
   - [ ] Efficient memory usage

## 🔧 Customization

### Modifying Lore Content

Edit the `loreShards` array in `src/components/LoreShards.jsx` to customize:
- Shard titles and descriptions
- Deep lore content
- Visual icons and colors

### Adjusting Difficulty

Modify constants in `src/lib/sequences.ts`:
- `DIFFICULTY_SETTINGS` for timing and length
- `GLYPH_COMMANDS` for command complexity
- `PATTERN_GROUPS` for pattern variety

### Changing Role Thresholds

Update the `ROLES` object in `src/lib/scoring.ts`:
- Score thresholds for each role
- Role descriptions and colors
- Grade letter boundaries

## 🛡️ Safety & Privacy

### Data Collection
- **No data collection** or user tracking
- **No personal information** stored or transmitted
- **Local storage only** for settings preference
- **No analytics** or third-party scripts

### Content Disclaimer
This is a fictional, aesthetic experience. No real recruitment, no data collection, no tracking. All roles and narratives are purely fictional entertainment content.

## 📄 License

This project is provided as-is for educational and entertainment purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests. Key areas for improvement:
- Additional sequence types
- More lore content
- Enhanced visual effects
- Accessibility improvements

---

**Built with React, Vite, and Tailwind CSS**
**Deployed as a static application**
**No backend required**