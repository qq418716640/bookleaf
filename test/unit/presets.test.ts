import { describe, it, expect } from 'vitest'
import {
  PRESETS,
  CANVAS_DIMENSIONS,
  getPresetById,
  getDefaultPreset,
  DEFAULTS,
} from '~/constants/presets'

describe('Presets Configuration', () => {
  describe('PRESETS Array', () => {
    it('contains exactly 3 presets', () => {
      expect(PRESETS).toHaveLength(3)
    })

    it('contains Editorial, Classic, and Modern presets', () => {
      const names = PRESETS.map((p) => p.name)
      expect(names).toContain('Editorial')
      expect(names).toContain('Classic')
      expect(names).toContain('Modern')
    })

    it('all presets have unique IDs', () => {
      const ids = PRESETS.map((p) => p.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(PRESETS.length)
    })
  })

  describe('Preset Field Completeness', () => {
    PRESETS.forEach((preset) => {
      describe(`${preset.name} preset`, () => {
        it('has all required fields', () => {
          expect(preset.id).toBeDefined()
          expect(preset.name).toBeDefined()
          expect(preset.thumbnailUrl).toBeDefined()
          expect(preset.backgroundUrl).toBeDefined()
          expect(preset.filterUrl).toBeDefined()
          expect(preset.defaultFilterOpacity).toBeDefined()
          expect(preset.quoteStyle).toBeDefined()
          expect(preset.authorStyle).toBeDefined()
          expect(preset.defaultQuoteAlignment).toBeDefined()
          expect(preset.defaultAuthorAlignment).toBeDefined()
        })

        it('has valid URL formats', () => {
          expect(preset.thumbnailUrl).toMatch(/^https?:\/\//)
          expect(preset.backgroundUrl).toMatch(/^https?:\/\//)
          expect(preset.filterUrl).toMatch(/^https?:\/\//)
        })

        it('has valid filter opacity (0-100)', () => {
          expect(preset.defaultFilterOpacity).toBeGreaterThanOrEqual(0)
          expect(preset.defaultFilterOpacity).toBeLessThanOrEqual(100)
        })

        it('has complete quote style', () => {
          expect(preset.quoteStyle.fontFamily).toBeDefined()
          expect(preset.quoteStyle.fontWeight).toBeGreaterThan(0)
          expect(preset.quoteStyle.fontStyle).toMatch(/^(normal|italic)$/)
          expect(preset.quoteStyle.fontSize).toBeGreaterThan(0)
          expect(preset.quoteStyle.lineHeight).toBeGreaterThan(0)
          expect(preset.quoteStyle.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
        })

        it('has complete author style', () => {
          expect(preset.authorStyle.fontFamily).toBeDefined()
          expect(preset.authorStyle.fontWeight).toBeGreaterThan(0)
          expect(preset.authorStyle.fontStyle).toMatch(/^(normal|italic)$/)
          expect(preset.authorStyle.fontSize).toBeGreaterThan(0)
          expect(preset.authorStyle.lineHeight).toBeGreaterThan(0)
          expect(preset.authorStyle.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
        })

        it('has valid alignment values', () => {
          expect(['left', 'center', 'right']).toContain(preset.defaultQuoteAlignment)
          expect(['left', 'center', 'right']).toContain(preset.defaultAuthorAlignment)
        })
      })
    })
  })

  describe('Editorial Preset', () => {
    const editorial = PRESETS.find((p) => p.name === 'Editorial')!

    it('uses Crimson Text font', () => {
      expect(editorial.quoteStyle.fontFamily).toBe('Crimson Text')
      expect(editorial.authorStyle.fontFamily).toBe('Crimson Text')
    })

    it('has correct font weights', () => {
      expect(editorial.quoteStyle.fontWeight).toBe(600)
      expect(editorial.authorStyle.fontWeight).toBe(600)
    })

    it('has correct font styles', () => {
      expect(editorial.quoteStyle.fontStyle).toBe('normal')
      expect(editorial.authorStyle.fontStyle).toBe('italic')
    })

    it('has correct default alignments', () => {
      expect(editorial.defaultQuoteAlignment).toBe('left')
      expect(editorial.defaultAuthorAlignment).toBe('right')
    })
  })

  describe('Classic Preset', () => {
    const classic = PRESETS.find((p) => p.name === 'Classic')!

    it('uses Averia Serif Libre font', () => {
      expect(classic.quoteStyle.fontFamily).toBe('Averia Serif Libre')
      expect(classic.authorStyle.fontFamily).toBe('Averia Serif Libre')
    })

    it('has correct font weights', () => {
      expect(classic.quoteStyle.fontWeight).toBe(700)
      expect(classic.authorStyle.fontWeight).toBe(700)
    })

    it('has correct font styles', () => {
      expect(classic.quoteStyle.fontStyle).toBe('normal')
      expect(classic.authorStyle.fontStyle).toBe('italic')
    })
  })

  describe('Modern Preset', () => {
    const modern = PRESETS.find((p) => p.name === 'Modern')!

    it('uses New Athena Unicode font', () => {
      expect(modern.quoteStyle.fontFamily).toBe('New Athena Unicode')
      expect(modern.authorStyle.fontFamily).toBe('New Athena Unicode')
    })

    it('has correct font weights', () => {
      expect(modern.quoteStyle.fontWeight).toBe(400)
      expect(modern.authorStyle.fontWeight).toBe(400)
    })

    it('has correct font styles', () => {
      expect(modern.quoteStyle.fontStyle).toBe('normal')
      expect(modern.authorStyle.fontStyle).toBe('normal')
    })

    it('has smaller font sizes than Editorial/Classic', () => {
      const editorial = PRESETS.find((p) => p.name === 'Editorial')!
      expect(modern.quoteStyle.fontSize).toBeLessThan(editorial.quoteStyle.fontSize)
      expect(modern.authorStyle.fontSize).toBeLessThan(editorial.authorStyle.fontSize)
    })
  })

  describe('Canvas Dimensions', () => {
    it('has dimensions for 1:1 aspect ratio', () => {
      expect(CANVAS_DIMENSIONS['1:1']).toBeDefined()
      expect(CANVAS_DIMENSIONS['1:1'].width).toBe(1080)
      expect(CANVAS_DIMENSIONS['1:1'].height).toBe(1080)
    })

    it('has dimensions for 4:5 aspect ratio', () => {
      expect(CANVAS_DIMENSIONS['4:5']).toBeDefined()
      expect(CANVAS_DIMENSIONS['4:5'].width).toBe(1080)
      expect(CANVAS_DIMENSIONS['4:5'].height).toBe(1350)
    })

    it('maintains correct aspect ratios', () => {
      const ratio1x1 = CANVAS_DIMENSIONS['1:1'].width / CANVAS_DIMENSIONS['1:1'].height
      expect(ratio1x1).toBeCloseTo(1, 2)

      const ratio4x5 = CANVAS_DIMENSIONS['4:5'].width / CANVAS_DIMENSIONS['4:5'].height
      expect(ratio4x5).toBeCloseTo(0.8, 2)
    })
  })

  describe('Helper Functions', () => {
    it('getPresetById returns correct preset', () => {
      const editorial = getPresetById('editorial')
      expect(editorial).toBeDefined()
      expect(editorial?.name).toBe('Editorial')
    })

    it('getPresetById returns undefined for invalid ID', () => {
      const invalid = getPresetById('invalid-id')
      expect(invalid).toBeUndefined()
    })

    it('getDefaultPreset returns first preset', () => {
      const defaultPreset = getDefaultPreset()
      expect(defaultPreset).toBe(PRESETS[0])
      expect(defaultPreset.name).toBe('Editorial')
    })
  })

  describe('Default Values', () => {
    it('has valid default preset ID', () => {
      const preset = getPresetById(DEFAULTS.PRESET_ID)
      expect(preset).toBeDefined()
    })

    it('has valid default filter intensity', () => {
      expect(DEFAULTS.FILTER_INTENSITY).toBeGreaterThanOrEqual(0)
      expect(DEFAULTS.FILTER_INTENSITY).toBeLessThanOrEqual(100)
    })

    it('has valid default aspect ratio', () => {
      expect(['1:1', '4:5']).toContain(DEFAULTS.ASPECT_RATIO)
    })

    it('has default text values', () => {
      expect(DEFAULTS.QUOTE_TEXT).toBeDefined()
      expect(DEFAULTS.AUTHOR_TEXT).toBeDefined()
    })
  })
})
