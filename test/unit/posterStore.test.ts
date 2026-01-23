import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePosterStore } from '~/stores/poster'
import { DEFAULTS } from '~/constants/presets'

describe('Poster Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Initial State', () => {
    it('initializes with default preset', () => {
      const store = usePosterStore()
      expect(store.currentPreset).toBeDefined()
      expect(store.currentPreset.name).toBe('Editorial')
    })

    it('initializes with default text values', () => {
      const store = usePosterStore()
      expect(store.quoteText).toBe(DEFAULTS.QUOTE_TEXT)
      expect(store.authorText).toBe(DEFAULTS.AUTHOR_TEXT)
    })

    it('initializes with default style values', () => {
      const store = usePosterStore()
      expect(store.filterIntensity).toBe(DEFAULTS.FILTER_INTENSITY)
      expect(store.aspectRatio).toBe(DEFAULTS.ASPECT_RATIO)
    })

    it('initializes with default alignment values', () => {
      const store = usePosterStore()
      expect(store.quoteAlignment).toBe('left')
      expect(store.authorAlignment).toBe('right')
    })

    it('initializes with loading states as false', () => {
      const store = usePosterStore()
      expect(store.fontsLoaded).toBe(false)
      expect(store.imagesLoaded).toBe(false)
      expect(store.isExporting).toBe(false)
    })

    it('initializes with no error', () => {
      const store = usePosterStore()
      expect(store.error).toBeNull()
    })
  })

  describe('Actions - Preset', () => {
    it('sets preset by ID', () => {
      const store = usePosterStore()
      store.setPreset('classic')
      expect(store.currentPreset.name).toBe('Classic')
    })

    it('resets alignments when changing preset', () => {
      const store = usePosterStore()
      store.setQuoteAlignment('center')
      store.setPreset('classic')
      expect(store.quoteAlignment).toBe(store.currentPreset.defaultQuoteAlignment)
      expect(store.authorAlignment).toBe(store.currentPreset.defaultAuthorAlignment)
    })

    it('resets filter intensity when changing preset', () => {
      const store = usePosterStore()
      store.setFilterIntensity(75)
      store.setPreset('modern')
      expect(store.filterIntensity).toBe(store.currentPreset.defaultFilterOpacity)
    })

    it('sets error for invalid preset ID', () => {
      const store = usePosterStore()
      store.setPreset('invalid-preset')
      expect(store.error).toContain('Preset not found')
    })

    it('clears error when setting valid preset', () => {
      const store = usePosterStore()
      store.setError('Test error')
      store.setPreset('editorial')
      expect(store.error).toBeNull()
    })
  })

  describe('Actions - Text', () => {
    it('updates quote text', () => {
      const store = usePosterStore()
      store.setQuoteText('New quote')
      expect(store.quoteText).toBe('New quote')
    })

    it('updates author text', () => {
      const store = usePosterStore()
      store.setAuthorText('New author')
      expect(store.authorText).toBe('New author')
    })

    it('clears error when updating text', () => {
      const store = usePosterStore()
      store.setError('Test error')
      store.setQuoteText('New quote')
      expect(store.error).toBeNull()
    })
  })

  describe('Actions - Style Controls', () => {
    it('updates filter intensity', () => {
      const store = usePosterStore()
      store.setFilterIntensity(75)
      expect(store.filterIntensity).toBe(75)
    })

    it('validates filter intensity range (0-100)', () => {
      const store = usePosterStore()
      store.setFilterIntensity(150)
      expect(store.error).toContain('must be between 0 and 100')
      expect(store.filterIntensity).toBe(DEFAULTS.FILTER_INTENSITY)
    })

    it('updates quote alignment', () => {
      const store = usePosterStore()
      store.setQuoteAlignment('center')
      expect(store.quoteAlignment).toBe('center')
    })

    it('updates author alignment', () => {
      const store = usePosterStore()
      store.setAuthorAlignment('left')
      expect(store.authorAlignment).toBe('left')
    })

    it('updates aspect ratio', () => {
      const store = usePosterStore()
      store.setAspectRatio('4:5')
      expect(store.aspectRatio).toBe('4:5')
    })
  })

  describe('Actions - Loading States', () => {
    it('updates fonts loaded state', () => {
      const store = usePosterStore()
      store.setFontsLoaded(true)
      expect(store.fontsLoaded).toBe(true)
    })

    it('updates images loaded state', () => {
      const store = usePosterStore()
      store.setImagesLoaded(true)
      expect(store.imagesLoaded).toBe(true)
    })

    it('updates exporting state', () => {
      const store = usePosterStore()
      store.setExporting(true)
      expect(store.isExporting).toBe(true)
    })
  })

  describe('Actions - Error Handling', () => {
    it('sets error message', () => {
      const store = usePosterStore()
      store.setError('Test error')
      expect(store.error).toBe('Test error')
    })

    it('clears error message', () => {
      const store = usePosterStore()
      store.setError('Test error')
      store.clearError()
      expect(store.error).toBeNull()
    })
  })

  describe('Actions - Reset', () => {
    it('resets all values to defaults', () => {
      const store = usePosterStore()
      store.setQuoteText('Custom quote')
      store.setFilterIntensity(75)
      store.setAspectRatio('4:5')
      store.reset()

      expect(store.quoteText).toBe(DEFAULTS.QUOTE_TEXT)
      expect(store.authorText).toBe(DEFAULTS.AUTHOR_TEXT)
      expect(store.filterIntensity).toBe(DEFAULTS.FILTER_INTENSITY)
      expect(store.aspectRatio).toBe(DEFAULTS.ASPECT_RATIO)
      expect(store.error).toBeNull()
    })

    it('resets only text inputs', () => {
      const store = usePosterStore()
      store.setQuoteText('Custom quote')
      store.setFilterIntensity(75)
      store.resetText()

      expect(store.quoteText).toBe(DEFAULTS.QUOTE_TEXT)
      expect(store.authorText).toBe(DEFAULTS.AUTHOR_TEXT)
      expect(store.filterIntensity).toBe(75) // Should not change
    })

    it('resets only style controls', () => {
      const store = usePosterStore()
      store.setQuoteText('Custom quote')
      store.setFilterIntensity(75)
      store.setQuoteAlignment('center')
      store.resetStyles()

      expect(store.quoteText).toBe('Custom quote') // Should not change
      expect(store.filterIntensity).toBe(store.currentPreset.defaultFilterOpacity)
      expect(store.quoteAlignment).toBe(store.currentPreset.defaultQuoteAlignment)
    })
  })

  describe('Getters - isExportReady', () => {
    it('returns false when fonts not loaded', () => {
      const store = usePosterStore()
      store.setImagesLoaded(true)
      expect(store.isExportReady).toBe(false)
    })

    it('returns false when images not loaded', () => {
      const store = usePosterStore()
      store.setFontsLoaded(true)
      expect(store.isExportReady).toBe(false)
    })

    it('returns false when exporting', () => {
      const store = usePosterStore()
      store.setFontsLoaded(true)
      store.setImagesLoaded(true)
      store.setExporting(true)
      expect(store.isExportReady).toBe(false)
    })

    it('returns false when quote text is empty', () => {
      const store = usePosterStore()
      store.setFontsLoaded(true)
      store.setImagesLoaded(true)
      store.setQuoteText('')
      expect(store.isExportReady).toBe(false)
    })

    it('returns true when all conditions met', () => {
      const store = usePosterStore()
      store.setFontsLoaded(true)
      store.setImagesLoaded(true)
      store.setQuoteText('Valid quote')
      expect(store.isExportReady).toBe(true)
    })
  })

  describe('Getters - currentConfig', () => {
    it('returns current configuration', () => {
      const store = usePosterStore()
      const config = store.currentConfig

      expect(config.preset).toBe(store.currentPreset)
      expect(config.quoteText).toBe(store.quoteText)
      expect(config.authorText).toBe(store.authorText)
      expect(config.quoteAlignment).toBe(store.quoteAlignment)
      expect(config.authorAlignment).toBe(store.authorAlignment)
      expect(config.filterIntensity).toBe(store.filterIntensity)
      expect(config.aspectRatio).toBe(store.aspectRatio)
    })
  })

  describe('Getters - filterOpacity', () => {
    it('converts intensity to opacity (0-1)', () => {
      const store = usePosterStore()
      store.setFilterIntensity(50)
      expect(store.filterOpacity).toBe(0.5)

      store.setFilterIntensity(0)
      expect(store.filterOpacity).toBe(0)

      store.setFilterIntensity(100)
      expect(store.filterOpacity).toBe(1)
    })
  })

  describe('Getters - hasChanges', () => {
    it('returns false for default state', () => {
      const store = usePosterStore()
      expect(store.hasChanges).toBe(false)
    })

    it('returns true when quote text changed', () => {
      const store = usePosterStore()
      store.setQuoteText('Custom quote')
      expect(store.hasChanges).toBe(true)
    })

    it('returns true when filter intensity changed', () => {
      const store = usePosterStore()
      store.setFilterIntensity(75)
      expect(store.hasChanges).toBe(true)
    })

    it('returns true when alignment changed', () => {
      const store = usePosterStore()
      store.setQuoteAlignment('center')
      expect(store.hasChanges).toBe(true)
    })

    it('returns true when aspect ratio changed', () => {
      const store = usePosterStore()
      store.setAspectRatio('4:5')
      expect(store.hasChanges).toBe(true)
    })
  })

  describe('Getters - availablePresets', () => {
    it('returns all presets', () => {
      const store = usePosterStore()
      expect(store.availablePresets).toHaveLength(3)
      expect(store.availablePresets[0].name).toBe('Editorial')
      expect(store.availablePresets[1].name).toBe('Classic')
      expect(store.availablePresets[2].name).toBe('Modern')
    })
  })
})
