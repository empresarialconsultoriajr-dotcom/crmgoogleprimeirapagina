import type { Config } from 'tailwindcss'

/**
 * Design system HS CAR'S.
 * A paleta é a da marca — o dourado existe como joia, nunca como superfície.
 */
/** Escala de opacidade completa: os fios da marca vivem entre 4% e 12%. */
const opacity = Object.fromEntries(
  Array.from({ length: 101 }, (_, i) => [String(i), String(i / 100)]),
)

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './sections/**/*.{ts,tsx}',
    './forms/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      opacity,
      colors: {
        ink: {
          DEFAULT: '#000000', // preto absoluto
          soft: '#0D0D0D',    // preto sofisticado
          raised: '#111111',
          graphite: '#1A1A1A',
          charcoal: '#36454F', // cinza carvão
        },
        gold: {
          DEFAULT: '#CFA060',
          deep: '#A97F45',
          pale: '#E4C79A',
        },
        bone: '#FFFFFF',
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.28em',
        wordmark: '0.18em',
        headline: '-0.025em',
      },
      maxWidth: {
        shell: '1320px',
        prose: '62ch',
      },
      screens: {
        xs: '390px',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'sheen-drift': {
          '0%,100%': { transform: 'translate3d(-1.5%, 0, 0) rotate(-14deg)', opacity: '0.7' },
          '50%': { transform: 'translate3d(2.5%, -1%, 0) rotate(-14deg)', opacity: '1' },
        },
        'cue-fall': {
          '0%': { transform: 'translateY(-60%)', opacity: '0' },
          '35%': { opacity: '1' },
          '100%': { transform: 'translateY(60%)', opacity: '0' },
        },
      },
      animation: {
        'sheen-drift': 'sheen-drift 26s ease-in-out infinite',
        'cue-fall': 'cue-fall 2.6s cubic-bezier(0.65, 0, 0.35, 1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
