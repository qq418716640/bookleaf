import { ref, computed } from 'vue'
import { ImageLoader } from '~/utils/ImageLoader'
import type { PresetConfig, LoadedImage } from '~/types'

// Singleton instance
const imageLoader = new ImageLoader()

/**
 * Vue composable for image loading with reactive state
 */
export function useImages() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const loadedUrls = ref<Set<string>>(new Set())

  const loadedCount = computed(() => loadedUrls.value.size)

  /**
   * Load a single image
   */
  async function loadImage(url: string): Promise<HTMLImageElement | null> {
    isLoading.value = true
    error.value = null

    try {
      const image = await imageLoader.loadImage(url)
      loadedUrls.value = new Set([...loadedUrls.value, url])
      return image
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load image'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Load all images for a preset
   */
  async function loadPresetImages(preset: PresetConfig) {
    isLoading.value = true
    error.value = null

    try {
      const images = await imageLoader.loadPresetImages(preset)
      loadedUrls.value = new Set([
        ...loadedUrls.value,
        preset.backgroundUrl,
        preset.filterUrl,
        preset.thumbnailUrl,
      ])
      return images
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load preset images'
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Load only render images (background + filter)
   */
  async function loadRenderImages(preset: PresetConfig) {
    isLoading.value = true
    error.value = null
    console.log('[useImages] Loading render images for preset:', preset.id)

    try {
      const images = await imageLoader.loadRenderImages(preset)
      loadedUrls.value = new Set([
        ...loadedUrls.value,
        preset.backgroundUrl,
        preset.filterUrl,
      ])
      console.log('[useImages] Render images loaded successfully')
      return images
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load render images'
      console.error('[useImages] Image loading error:', e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Preload thumbnails for all presets
   */
  async function preloadThumbnails(presets: PresetConfig[]) {
    isLoading.value = true
    error.value = null

    try {
      await imageLoader.preloadThumbnails(presets)
      presets.forEach((preset) => {
        loadedUrls.value = new Set([...loadedUrls.value, preset.thumbnailUrl])
      })
    } catch (e) {
      // Non-critical error, just log
      console.warn('Some thumbnails failed to preload:', e)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Check if an image is loaded
   */
  function isImageLoaded(url: string): boolean {
    return imageLoader.isImageLoaded(url)
  }

  /**
   * Get a loaded image
   */
  function getImage(url: string): HTMLImageElement | null {
    return imageLoader.getImage(url)
  }

  /**
   * Get all loaded images
   */
  function getLoadedImages(): LoadedImage[] {
    return imageLoader.getLoadedImages()
  }

  /**
   * Clear all cached images
   */
  function clearImages() {
    imageLoader.clear()
    loadedUrls.value = new Set()
  }

  return {
    // State
    isLoading,
    error,
    loadedCount,

    // Methods
    loadImage,
    loadPresetImages,
    loadRenderImages,
    preloadThumbnails,
    isImageLoaded,
    getImage,
    getLoadedImages,
    clearImages,
  }
}
