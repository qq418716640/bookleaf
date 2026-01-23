import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FontManager } from '~/utils/FontManager'

// Mock FontFace API
class MockFontFace {
  family: string
  source: string
  descriptors: any

  constructor(family: string, source: string, descriptors: any = {}) {
    this.family = family
    this.source = source
    this.descriptors = descriptors
  }

  async load() {
    return this
  }
}

// Mock document.fonts
const mockFonts = {
  add: vi.fn(),
  ready: Promise.resolve(),
}

// Setup global mocks
global.FontFace = MockFontFace as any
global.document = {
  ...global.document,
  fonts: mockFonts as any,
}

describe('FontManager', () => {
  let fontManager: FontManager

  beforeEach(() => {
    fontManager = new FontManager()
    fontManager.clear()
    vi.clearAllMocks()
  })

  describe('loadFont', () => {
    it('loads a font successfully', async () => {
      const config = {
        family: 'Crimson Text',
        weight: 600,
        style: 'normal' as const,
        url: '/fonts/CrimsonText-SemiBold.ttf',
      }

      await fontManager.loadFont(config)

      expect(mockFonts.add).toHaveBeenCalled()
      expect(fontManager.isFontLoaded('Crimson Text', 600, 'normal')).toBe(true)
    })

    it('does not load the same font twice', async () => {
      const config = {
        family: 'Crimson Text',
        weight: 600,
        style: 'normal' as const,
        url: '/fonts/CrimsonText-SemiBold.ttf',
      }

      await fontManager.loadFont(config)
      await fontManager.loadFont(config)

      // Should only be called once
      expect(mockFonts.add).toHaveBeenCalledTimes(1)
    })

    it('handles concurrent loading of the same font', async () => {
      const config = {
        family: 'Crimson Text',
        weight: 600,
        style: 'normal' as const,
        url: '/fonts/CrimsonText-SemiBold.ttf',
      }

      // Load the same font concurrently
      await Promise.all([
        fontManager.loadFont(config),
        fontManager.loadFont(config),
        fontManager.loadFont(config),
      ])

      // Should only be called once
      expect(mockFonts.add).toHaveBeenCalledTimes(1)
    })
  })

  describe('loadPresetFonts', () => {
    it('loads both quote and author fonts', async () => {
      await fontManager.loadPresetFonts(
        'Crimson Text',
        600,
        'normal',
        'Crimson Text',
        600,
        'italic'
      )

      expect(fontManager.isFontLoaded('Crimson Text', 600, 'normal')).toBe(true)
      expect(fontManager.isFontLoaded('Crimson Text', 600, 'italic')).toBe(true)
    })

    it('loads only one font when quote and author use the same font', async () => {
      await fontManager.loadPresetFonts(
        'Crimson Text',
        600,
        'normal',
        'Crimson Text',
        600,
        'normal'
      )

      // Should only load once
      expect(mockFonts.add).toHaveBeenCalledTimes(1)
    })

    it('loads different font families', async () => {
      await fontManager.loadPresetFonts(
        'Crimson Text',
        600,
        'normal',
        'Averia Serif Libre',
        700,
        'italic'
      )

      expect(fontManager.isFontLoaded('Crimson Text', 600, 'normal')).toBe(true)
      expect(fontManager.isFontLoaded('Averia Serif Libre', 700, 'italic')).toBe(true)
    })
  })

  describe('isFontLoaded', () => {
    it('returns false for unloaded font', () => {
      expect(fontManager.isFontLoaded('Crimson Text', 600, 'normal')).toBe(false)
    })

    it('returns true for loaded font', async () => {
      const config = {
        family: 'Crimson Text',
        weight: 600,
        style: 'normal' as const,
        url: '/fonts/CrimsonText-SemiBold.ttf',
      }

      await fontManager.loadFont(config)
      expect(fontManager.isFontLoaded('Crimson Text', 600, 'normal')).toBe(true)
    })

    it('distinguishes between different font styles', async () => {
      const normalConfig = {
        family: 'Crimson Text',
        weight: 600,
        style: 'normal' as const,
        url: '/fonts/CrimsonText-SemiBold.ttf',
      }

      await fontManager.loadFont(normalConfig)

      expect(fontManager.isFontLoaded('Crimson Text', 600, 'normal')).toBe(true)
      expect(fontManager.isFontLoaded('Crimson Text', 600, 'italic')).toBe(false)
    })
  })

  describe('getLoadedFonts', () => {
    it('returns empty array initially', () => {
      expect(fontManager.getLoadedFonts()).toEqual([])
    })

    it('returns loaded font keys', async () => {
      const config = {
        family: 'Crimson Text',
        weight: 600,
        style: 'normal' as const,
        url: '/fonts/CrimsonText-SemiBold.ttf',
      }

      await fontManager.loadFont(config)
      const loaded = fontManager.getLoadedFonts()

      expect(loaded).toHaveLength(1)
      expect(loaded[0]).toContain('Crimson Text')
      expect(loaded[0]).toContain('600')
      expect(loaded[0]).toContain('normal')
    })

    it('returns multiple loaded fonts', async () => {
      await fontManager.loadPresetFonts(
        'Crimson Text',
        600,
        'normal',
        'Crimson Text',
        600,
        'italic'
      )

      const loaded = fontManager.getLoadedFonts()
      expect(loaded.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('clear', () => {
    it('clears all loaded fonts', async () => {
      const config = {
        family: 'Crimson Text',
        weight: 600,
        style: 'normal' as const,
        url: '/fonts/CrimsonText-SemiBold.ttf',
      }

      await fontManager.loadFont(config)
      expect(fontManager.getLoadedFonts()).toHaveLength(1)

      fontManager.clear()
      expect(fontManager.getLoadedFonts()).toHaveLength(0)
      expect(fontManager.isFontLoaded('Crimson Text', 600, 'normal')).toBe(false)
    })
  })

  describe('waitForFonts', () => {
    it('waits for document.fonts.ready', async () => {
      await expect(fontManager.waitForFonts()).resolves.toBeUndefined()
    })
  })
})
