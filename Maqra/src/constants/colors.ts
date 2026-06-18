// ─────────────────────────────────────────────────────────────────────────────
// MAQRA — Design System Tokens
// Source: DESIGN.md  (Neo-Mediterranean / Moroccan aesthetic)
// ─────────────────────────────────────────────────────────────────────────────

export const Colors = {
  // ── Backgrounds ────────────────────────────────────────────────────────────
  background:               '#FDF9F3', // Sand / Cream – warm paper feel
  surface:                  '#FFFFFF', // White card surface
  surfaceContainerLow:      '#F7F3ED',
  surfaceContainerHigh:     '#EBE8E2',

  // ── Primary – Majorelle Blue ────────────────────────────────────────────────
  primary:                  '#4734C3',
  primaryContainer:         '#6050DC', // brand accent on buttons / rings
  onPrimary:                '#FFFFFF',
  onPrimaryContainer:       '#E7E2FF',
  inversePrimary:           '#C6BFFF',

  // ── Secondary – Terracotta ──────────────────────────────────────────────────
  secondary:                '#9F402D',
  secondaryContainer:       '#FD876F', // "Reading" badge bg
  onSecondary:              '#FFFFFF',
  onSecondaryContainer:     '#732010',

  // ── Tertiary – Mint Green ───────────────────────────────────────────────────
  tertiary:                 '#005A40',
  tertiaryContainer:        '#007554', // "Completed" badge bg
  onTertiary:               '#FFFFFF',
  onTertiaryContainer:      '#89FBCB',

  // ── Error ──────────────────────────────────────────────────────────────────
  error:                    '#BA1A1A',
  onError:                  '#FFFFFF',

  // ── Neutrals ───────────────────────────────────────────────────────────────
  onSurface:                '#1C1C18', // Ink – soft off-black
  onSurfaceVariant:         '#474554',
  outline:                  '#787586',
  outlineVariant:           '#C8C4D7',
  border:                   '#E8E2D9', // 1px subtle card stroke

  // ── Semantic shorthands ─────────────────────────────────────────────────────
  majorelleBlue:            '#6050DC',
  terracotta:               '#E2725B',
  mintGreen:                '#3EB489',
  sand:                     '#FDF9F3',
  ink:                      '#2D2926',
} as const;

// ── Shadows ───────────────────────────────────────────────────────────────────
export const Shadows = {
  /** Level 1 – card resting state */
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 2,
  },
  /** Level 2 – active / interaction */
  active: {
    shadowColor: '#6050DC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 6,
  },
} as const;

// ── Radii ─────────────────────────────────────────────────────────────────────
export const Radii = {
  sm:   4,
  md:   8,
  lg:   16,  // main cards & containers
  xl:   24,
  full: 9999, // pill buttons
} as const;

// ── Spacing (8px soft grid) ───────────────────────────────────────────────────
export const Spacing = {
  xs:     4,
  sm:     8,
  md:     16,
  lg:     24,
  xl:     32,
  gutter: 20, // horizontal safe-area margin
} as const;
