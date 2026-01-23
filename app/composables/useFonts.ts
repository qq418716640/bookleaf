import { ref, computed } from 'vue'
import { fontManager } from '~/utils/FontManager'
import type { PresetConfig } from '~/types'

/**
 * Composable for managing font loading in Vue components
 * Provides reactive state for font loading status
 */
export function useFonts() {
  const isLoading = ref(false)
  const isLoaded = ref(false)
  const error = ref<string | null>(null)
  const loadedFonts = ref<string[]>([])

  /**
   * Load fonts for a specific preset
   */
  const loadPresetFonts = async (preset: PresetConfig): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    console.log('[useFonts] Loading fonts for preset:', preset.id)

    try {
      await fontManager.loadPresetFonts(
        preset.quoteStyle.fontFamily,
        preset.quoteStyle.fontWeight,
        preset.quoteStyle.fontStyle,
        preset.authorStyle.fontFamily,
        preset.authorStyle.fontWeight,
        preset.authorStyle.fontStyle
      )

      // Wait for all fonts to be ready
      await fontManager.waitForFonts()

      loadedFonts.value = fontManager.getLoadedFonts()
      isLoaded.value = true
      isLoading.value = false

      console.log('[useFonts] Fonts loaded successfully:', loadedFonts.value)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load fonts'
      isLoading.value = false
      isLoaded.value = false
      console.error('[useFonts] Font loading error:', err)
      return false
    }
  }

  /**
   * Check if a specific font is loaded
   */
  const isFontLoaded = (family: string, weight: number, style: 'normal' | 'italic'): boolean => {
    return fontManager.isFontLoaded(family, weight, style)
  }

  /**
   * Reset font loading state
   */
  const reset = (): void => {
    isLoading.value = false
    isLoaded.value = false
    error.value = null
    loadedFonts.value = []
  }

  /**
   * Computed property for ready state
   */
  const isReady = computed(() => isLoaded.value && !isLoading.value && !error.value)

  return {
    // State
    isLoading: readonly(isLoading),
    isLoaded: readonly(isLoaded),
    isReady,
    error: readonly(error),
    loadedFonts: readonly(loadedFonts),

    // Methods
    loadPresetFonts,
    isFontLoaded,
    reset,
  }
}
