import type { LoadedImage, PresetConfig } from '~/types'

/**
 * ImageLoader handles loading images with CORS support
 * Essential for canvas operations with external images
 */
export class ImageLoader {
  private loadedImages: Map<string, HTMLImageElement> = new Map()
  private loadingPromises: Map<string, Promise<HTMLImageElement>> = new Map()

  /**
   * Load a single image with CORS support
   */
  async loadImage(url: string): Promise<HTMLImageElement> {
    // Return cached image if available
    if (this.loadedImages.has(url)) {
      return this.loadedImages.get(url)!
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!
    }

    // Create loading promise
    const loadingPromise = this.loadImageInternal(url)
    this.loadingPromises.set(url, loadingPromise)

    try {
      const image = await loadingPromise
      this.loadedImages.set(url, image)
      return image
    } finally {
      this.loadingPromises.delete(url)
    }
  }

  /**
   * Internal image loading implementation
   */
  private loadImageInternal(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()

      // Set crossOrigin for CORS support (required for canvas export)
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        console.log(`Image loaded: ${url}`)
        resolve(img)
      }

      img.onerror = (error) => {
        console.error(`Failed to load image: ${url}`, error)
        reject(new Error(`Failed to load image: ${url}`))
      }

      // Start loading
      img.src = url
    })
  }

  /**
   * Load all images for a preset (background and filter)
   */
  async loadPresetImages(preset: PresetConfig): Promise<{
    background: HTMLImageElement
    filter: HTMLImageElement
    thumbnail: HTMLImageElement
  }> {
    try {
      const [background, filter, thumbnail] = await Promise.all([
        this.loadImage(preset.backgroundUrl),
        this.loadImage(preset.filterUrl),
        this.loadImage(preset.thumbnailUrl),
      ])

      return { background, filter, thumbnail }
    } catch (error) {
      console.error('Failed to load preset images:', error)
      throw error
    }
  }

  /**
   * Load only background and filter images (for rendering)
   */
  async loadRenderImages(preset: PresetConfig): Promise<{
    background: HTMLImageElement
    filter: HTMLImageElement
  }> {
    try {
      const [background, filter] = await Promise.all([
        this.loadImage(preset.backgroundUrl),
        this.loadImage(preset.filterUrl),
      ])

      return { background, filter }
    } catch (error) {
      console.error('Failed to load render images:', error)
      throw error
    }
  }

  /**
   * Preload thumbnail images for all presets
   */
  async preloadThumbnails(presets: PresetConfig[]): Promise<void> {
    try {
      await Promise.all(presets.map((preset) => this.loadImage(preset.thumbnailUrl)))
      console.log('All thumbnails preloaded')
    } catch (error) {
      console.warn('Some thumbnails failed to load:', error)
      // Don't throw - thumbnails are not critical
    }
  }

  /**
   * Check if an image is loaded
   */
  isImageLoaded(url: string): boolean {
    return this.loadedImages.has(url)
  }

  /**
   * Get a loaded image
   */
  getImage(url: string): HTMLImageElement | null {
    return this.loadedImages.get(url) || null
  }

  /**
   * Get all loaded images
   */
  getLoadedImages(): LoadedImage[] {
    return Array.from(this.loadedImages.entries()).map(([url, image]) => ({
      url,
      image,
    }))
  }

  /**
   * Get count of loaded images
   */
  getLoadedCount(): number {
    return this.loadedImages.size
  }

  /**
   * Clear a specific image from cache
   */
  clearImage(url: string): void {
    this.loadedImages.delete(url)
  }

  /**
   * Clear all loaded images
   */
  clear(): void {
    this.loadedImages.clear()
    this.loadingPromises.clear()
  }
}

// Export singleton instance
export const imageLoader = new ImageLoader()
