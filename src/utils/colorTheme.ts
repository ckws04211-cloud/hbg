export interface ColorTheme {
  main: string
  light: string
  dark: string
  particleColors: string[]
  textGradient: string
  textGlow: string
  cardBorder: string
  cardGlow: string
  accentText: string
  radialGlow: string
  buttonBorder: string
  buttonBg: string
  buttonText: string
  buttonShadow: string
}

function parseHex(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.trim().replace('#', '')
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized.slice(0, 6)

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((value) =>
      Math.round(Math.max(0, Math.min(255, value)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`
}

function mixColor(hex: string, target: { r: number; g: number; b: number }, amount: number): string {
  const source = parseHex(hex)
  return rgbToHex(
    source.r + (target.r - source.r) * amount,
    source.g + (target.g - source.g) * amount,
    source.b + (target.b - source.b) * amount,
  )
}

export function toRgba(hex: string, alpha: number): string {
  const { r, g, b } = parseHex(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function createColorTheme(color: string): ColorTheme {
  const main = color.startsWith('#') ? color : `#${color}`
  const light = mixColor(main, { r: 255, g: 255, b: 255 }, 0.45)
  const dark = mixColor(main, { r: 0, g: 0, b: 0 }, 0.25)

  return {
    main,
    light,
    dark,
    particleColors: [main, light, '#FFFFFF', dark, mixColor(main, { r: 255, g: 255, b: 255 }, 0.7)],
    textGradient: `linear-gradient(135deg, ${light} 0%, ${main} 45%, ${dark} 75%, ${light} 100%)`,
    textGlow: `0 0 10px ${toRgba(main, 0.8)}, 0 0 30px ${toRgba(main, 0.5)}, 0 0 60px ${toRgba(dark, 0.35)}`,
    cardBorder: toRgba(main, 0.5),
    cardGlow: `0 0 20px ${toRgba(main, 0.3)}, 0 0 60px ${toRgba(main, 0.15)}, inset 0 0 20px ${toRgba(main, 0.05)}`,
    accentText: toRgba(main, 0.85),
    radialGlow: `radial-gradient(circle at center, ${toRgba(main, 0.25)} 0%, transparent 60%)`,
    buttonBorder: toRgba(main, 0.4),
    buttonBg: toRgba(main, 0.1),
    buttonText: light,
    buttonShadow: `0 0 24px ${toRgba(main, 0.15)}`,
  }
}

export const DEFAULT_THEME_COLOR = '#C9A962'
