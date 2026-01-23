import { ref, computed, watch } from 'vue'
import type { PresetConfig, TextAlignment, AspectRatio } from '~/types'
import { PRESETS } from '~/constants/presets'
import { usePosterStore } from '~/stores/poster'
import { useImages } from '~/composables/useImages'
import { useFonts } from '~/composables/useFonts'
import { ExportManager } from '~/utils/ExportManager'
import type { RenderConfig } from '~/utils/PosterRenderer'

/**
 * Main application composable for poster generator
 * Integrates all managers and provides unified API
 */
export function usePosterApp() {
  const store = usePosterStore()
  const images = useImages()
  const fonts = useFonts()
  const exportManager = new ExportManager()

  // Loading states
  const isInitializing = ref(true)
  const isExporting = ref(false)
  const error = ref<string | null>(null)

  // Current loaded images
  const backgroundImage = ref<HTMLImageElement | null>(null)
  const filterImage = ref<HTMLImageElement | null>(null)

  // Computed states
  const isReady = computed(() => {
    const ready = (
      !isInitializing.value &&
      store.currentPreset !== null &&
      backgroundImage.value !== null &&
      filterImage.value !== null &&
      fonts.isLoaded.value
    )
    
    console.log('[usePosterApp] isReady check:', {
      isInitializing: isInitializing.value,
      hasPreset: store.currentPreset !== null,
      hasBackground: backgroundImage.value !== null,
      hasFilter: filterImage.value !== null,
      fontsLoaded: fonts.isLoaded.value,
      result: ready
    })
    
    return ready
  })

  const canExport = computed(() => {
    const can = isReady.value && store.quoteText.trim().length > 0
    console.log('[usePosterApp] canExport check:', {
      isReady: isReady.value,
      hasQuoteText: store.quoteText.trim().length > 0,
      result: can
    })
    return can
  })

  const currentRenderConfig = computed<RenderConfig | null>(() => {
    if (!store.currentPreset) return null
    return {
      preset: store.currentPreset,
      quoteText: store.quoteText,
      authorText: store.authorText,
      quoteAlignment: store.quoteAlignment,
      authorAlignment: store.authorAlignment,
      filterIntensity: store.filterIntensity,
      aspectRatio: store.aspectRatio,
    }
  })

  /**
   * Initialize the application
   */
  async function initialize() {
    isInitializing.value = true
    error.value = null

    try {
      // Preload thumbnails for all presets
      await images.preloadThumbnails(PRESETS)

      // Load fonts for default preset
      const defaultPreset = PRESETS[0]
      if (defaultPreset) {
        await loadPreset(defaultPreset)
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to initialize'
      console.error('Initialization error:', e)
    } finally {
      isInitializing.value = false
    }
  }

  /**
   * Load a preset (images and fonts)
   */
  async function loadPreset(preset: PresetConfig) {
    error.value = null

    try {
      // Update store with preset ID
      store.setPreset(preset.id)

      // Load images and fonts in parallel
      const [loadedImages, fontsSuccess] = await Promise.all([
        images.loadRenderImages(preset),
        fonts.loadPresetFonts(preset)
      ])

      // Update images
      if (loadedImages) {
        backgroundImage.value = loadedImages.background
        filterImage.value = loadedImages.filter
        store.setImagesLoaded(true)
        console.log('[usePosterApp] Images loaded successfully')
      } else {
        throw new Error('Failed to load images')
      }

      // Update fonts
      if (fontsSuccess) {
        store.setFontsLoaded(true)
        console.log('[usePosterApp] Fonts loaded successfully')
      } else {
        throw new Error('Failed to load fonts')
      }

      console.log('[usePosterApp] Preset fully loaded:', {
        preset: preset.id,
        imagesLoaded: store.imagesLoaded,
        fontsLoaded: store.fontsLoaded
      })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load preset'
      console.error('[usePosterApp] Preset loading error:', e)
      // Reset loading states on error
      store.setImagesLoaded(false)
      store.setFontsLoaded(false)
    }
  }

  /**
   * Select a preset
   */
  async function selectPreset(preset: PresetConfig) {
    if (preset.id === store.currentPreset?.id) return
    await loadPreset(preset)
  }

  /**
   * Update quote text
   */
  function setQuoteText(text: string) {
    store.setQuoteText(text)
  }

  /**
   * Update author text
   */
  function setAuthorText(text: string) {
    store.setAuthorText(text)
  }

  /**
   * Update filter intensity
   */
  function setFilterIntensity(intensity: number) {
    store.setFilterIntensity(intensity)
  }

  /**
   * Update quote alignment
   */
  function setQuoteAlignment(alignment: TextAlignment) {
    store.setQuoteAlignment(alignment)
  }

  /**
   * Update author alignment
   */
  function setAuthorAlignment(alignment: TextAlignment) {
    store.setAuthorAlignment(alignment)
  }

  /**
   * Update aspect ratio
   */
  function setAspectRatio(ratio: AspectRatio) {
    store.setAspectRatio(ratio)
  }

  /**
   * Export poster as PNG
   */
  async function exportPoster(): Promise<boolean> {
    if (!canExport.value || !currentRenderConfig.value || !backgroundImage.value || !filterImage.value) {
      error.value = 'Cannot export: missing required data'
      return false
    }

    isExporting.value = true
    error.value = null

    try {
      const result = await exportManager.downloadPoster(
        currentRenderConfig.value,
        backgroundImage.value,
        filterImage.value,
        { format: 'png' }
      )

      if (!result.success) {
        error.value = result.error || 'Export failed'
        return false
      }

      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Export failed'
      return false
    } finally {
      isExporting.value = false
    }
  }

  /**
   * Reset to default state
   */
  function reset() {
    store.reset()
    backgroundImage.value = null
    filterImage.value = null
    error.value = null
  }

  // Watch for preset changes to reload images
  watch(
    () => store.currentPreset,
    async (newPreset) => {
      if (newPreset && !images.isImageLoaded(newPreset.backgroundUrl)) {
        await loadPreset(newPreset)
      }
    }
  )

  return {
    // State
    presets: PRESETS,
    currentPreset: computed(() => store.currentPreset),
    quoteText: computed(() => store.quoteText),
    authorText: computed(() => store.authorText),
    filterIntensity: computed(() => store.filterIntensity),
    quoteAlignment: computed(() => store.quoteAlignment),
    authorAlignment: computed(() => store.authorAlignment),
    aspectRatio: computed(() => store.aspectRatio),
    backgroundImage,
    filterImage,

    // Loading states
    isInitializing,
    isExporting,
    isReady,
    canExport,
    error,

    // Font loading state
    fontsLoading: fonts.isLoading,
    fontsLoaded: fonts.isLoaded,

    // Image loading state
    imagesLoading: images.isLoading,

    // Actions
    initialize,
    selectPreset,
    setQuoteText,
    setAuthorText,
    setFilterIntensity,
    setQuoteAlignment,
    setAuthorAlignment,
    setAspectRatio,
    exportPoster,
    reset,
  }
}
