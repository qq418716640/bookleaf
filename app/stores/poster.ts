import { defineStore } from 'pinia'
import type { PresetConfig, TextAlignment, AspectRatio } from '~/types'
import { PRESETS, DEFAULTS, getPresetById, getDefaultPreset } from '~/constants/presets'

export const usePosterStore = defineStore('poster', {
  state: () => ({
    // Current preset
    currentPreset: getDefaultPreset() as PresetConfig,

    // User inputs
    quoteText: DEFAULTS.QUOTE_TEXT,
    authorText: DEFAULTS.AUTHOR_TEXT,

    // Style controls
    filterIntensity: DEFAULTS.FILTER_INTENSITY,
    quoteAlignment: 'left' as TextAlignment,
    authorAlignment: 'right' as TextAlignment,
    aspectRatio: DEFAULTS.ASPECT_RATIO as AspectRatio,

    // Loading states
    fontsLoaded: false,
    imagesLoaded: false,
    isExporting: false,

    // Error states
    error: null as string | null,
  }),

  getters: {
    /**
     * Check if the app is ready to export
     */
    isExportReady: (state): boolean => {
      return (
        state.fontsLoaded &&
        state.imagesLoaded &&
        !state.isExporting &&
        state.quoteText.trim().length > 0
      )
    },

    /**
     * Get current configuration for rendering
     */
    currentConfig: (state) => {
      return {
        preset: state.currentPreset,
        quoteText: state.quoteText,
        authorText: state.authorText,
        quoteAlignment: state.quoteAlignment,
        authorAlignment: state.authorAlignment,
        filterIntensity: state.filterIntensity,
        aspectRatio: state.aspectRatio,
      }
    },

    /**
     * Get all available presets
     */
    availablePresets: () => PRESETS,

    /**
     * Get filter opacity as decimal (0-1) from intensity (0-100)
     */
    filterOpacity: (state): number => {
      return state.filterIntensity / 100
    },

    /**
     * Check if current state has unsaved changes
     */
    hasChanges: (state): boolean => {
      return (
        state.quoteText !== DEFAULTS.QUOTE_TEXT ||
        state.authorText !== DEFAULTS.AUTHOR_TEXT ||
        state.filterIntensity !== DEFAULTS.FILTER_INTENSITY ||
        state.quoteAlignment !== state.currentPreset.defaultQuoteAlignment ||
        state.authorAlignment !== state.currentPreset.defaultAuthorAlignment ||
        state.aspectRatio !== DEFAULTS.ASPECT_RATIO
      )
    },
  },

  actions: {
    /**
     * Set the current preset
     */
    setPreset(presetId: string) {
      const preset = getPresetById(presetId)
      if (preset) {
        this.currentPreset = preset
        // Reset alignments to preset defaults
        this.quoteAlignment = preset.defaultQuoteAlignment
        this.authorAlignment = preset.defaultAuthorAlignment
        // Reset filter intensity to preset default
        this.filterIntensity = preset.defaultFilterOpacity
        // Clear any errors
        this.error = null
      } else {
        this.error = `Preset not found: ${presetId}`
      }
    },

    /**
     * Update quote text
     */
    setQuoteText(text: string) {
      this.quoteText = text
      this.error = null
    },

    /**
     * Update author text
     */
    setAuthorText(text: string) {
      this.authorText = text
      this.error = null
    },

    /**
     * Update filter intensity (0-100)
     */
    setFilterIntensity(intensity: number) {
      if (intensity >= 0 && intensity <= 100) {
        this.filterIntensity = intensity
        this.error = null
      } else {
        this.error = 'Filter intensity must be between 0 and 100'
      }
    },

    /**
     * Update quote alignment
     */
    setQuoteAlignment(alignment: TextAlignment) {
      this.quoteAlignment = alignment
      this.error = null
    },

    /**
     * Update author alignment
     */
    setAuthorAlignment(alignment: TextAlignment) {
      this.authorAlignment = alignment
      this.error = null
    },

    /**
     * Update aspect ratio
     */
    setAspectRatio(ratio: AspectRatio) {
      this.aspectRatio = ratio
      this.error = null
    },

    /**
     * Set fonts loaded state
     */
    setFontsLoaded(loaded: boolean) {
      this.fontsLoaded = loaded
    },

    /**
     * Set images loaded state
     */
    setImagesLoaded(loaded: boolean) {
      this.imagesLoaded = loaded
    },

    /**
     * Set exporting state
     */
    setExporting(exporting: boolean) {
      this.isExporting = exporting
    },

    /**
     * Set error message
     */
    setError(error: string | null) {
      this.error = error
    },

    /**
     * Clear error message
     */
    clearError() {
      this.error = null
    },

    /**
     * Reset to default values
     */
    reset() {
      this.currentPreset = getDefaultPreset()
      this.quoteText = DEFAULTS.QUOTE_TEXT
      this.authorText = DEFAULTS.AUTHOR_TEXT
      this.filterIntensity = DEFAULTS.FILTER_INTENSITY
      this.quoteAlignment = this.currentPreset.defaultQuoteAlignment
      this.authorAlignment = this.currentPreset.defaultAuthorAlignment
      this.aspectRatio = DEFAULTS.ASPECT_RATIO
      this.error = null
    },

    /**
     * Reset only text inputs
     */
    resetText() {
      this.quoteText = DEFAULTS.QUOTE_TEXT
      this.authorText = DEFAULTS.AUTHOR_TEXT
      this.error = null
    },

    /**
     * Reset only style controls
     */
    resetStyles() {
      this.filterIntensity = this.currentPreset.defaultFilterOpacity
      this.quoteAlignment = this.currentPreset.defaultQuoteAlignment
      this.authorAlignment = this.currentPreset.defaultAuthorAlignment
      this.error = null
    },
  },
})
