import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { ImageLoader } from '~/utils/ImageLoader'
import type { PresetConfig } from '~/types'

// Mock HTMLImageElement
class MockImage {
  src: string = ''
  crossOrigin: string | null = null
  onload: (() => void) | null = null
  onerror: ((error: Event) => void) | null = null
  width: number = 100
  height: number = 100

  constructor() {
    // Simulate async image loading
    setTimeout(() => {
      if (this.src.includes('error') || this.src.includes('fail')) {
        this.onerror?.(new Event('error'))
      } else {
        this.onload?.()
      }
    }, 10)
  }
}

// Replace global Image with mock
vi.stubGlobal('Image', MockImage)

// Mock preset for testing
const mockPreset: PresetConfig = {
  id: 'test-preset',
  name: 'Editorial',
  thumbnailUrl: 'https://example.com/thumbnail.jpg',
  backgroundUrl: 'https://example.com/background.jpg',
  filterUrl: 'https://example.com/filter.png',
  defaultFilterOpacity: 0.5,
  quoteStyle: {
    fontFamily: 'Crimson Text',
    fontWeight: 400,
    fontStyle: 'italic',
    fontSize: 48,
    lineHeight: 1.4,
    color: '#1a1a1a',
  },
  authorStyle: {
    fontFamily: 'Crimson Text',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: 24,
    lineHeight: 1.5,
    color: '#333333',
  },
  defaultQuoteAlignment: 'center',
  defaultAuthorAlignment: 'center',
}

describe('ImageLoader', () => {
  let imageLoader: ImageLoader

  beforeEach(() => {
    imageLoader = new ImageLoader()
    vi.clearAllMocks()
  })

  afterEach(() => {
    imageLoader.clear()
  })

  describe('loadImage', () => {
    it('should load an image successfully', async () => {
      const url = 'https://example.com/test.jpg'
      const image = await imageLoader.loadImage(url)

      expect(image).toBeDefined()
      expect(image.src).toBe(url)
    })

    it('should set crossOrigin to anonymous for CORS support (Property 11)', async () => {
      const url = 'https://example.com/test.jpg'
      const image = await imageLoader.loadImage(url)

      expect(image.crossOrigin).toBe('anonymous')
    })

    it('should cache loaded images', async () => {
      const url = 'https://example.com/test.jpg'

      const image1 = await imageLoader.loadImage(url)
      const image2 = await imageLoader.loadImage(url)

      expect(image1).toBe(image2)
      expect(imageLoader.getLoadedCount()).toBe(1)
    })

    it('should reuse loading promise for concurrent requests', async () => {
      const url = 'https://example.com/test.jpg'

      const promise1 = imageLoader.loadImage(url)
      const promise2 = imageLoader.loadImage(url)

      const [image1, image2] = await Promise.all([promise1, promise2])

      expect(image1).toBe(image2)
      expect(imageLoader.getLoadedCount()).toBe(1)
    })

    it('should handle image loading errors (Property 12)', async () => {
      const url = 'https://example.com/error-image.jpg'

      await expect(imageLoader.loadImage(url)).rejects.toThrow('Failed to load image')
    })
  })

  describe('loadPresetImages', () => {
    it('should load all preset images', async () => {
      const result = await imageLoader.loadPresetImages(mockPreset)

      expect(result.background).toBeDefined()
      expect(result.filter).toBeDefined()
      expect(result.thumbnail).toBeDefined()
      expect(result.background.src).toBe(mockPreset.backgroundUrl)
      expect(result.filter.src).toBe(mockPreset.filterUrl)
      expect(result.thumbnail.src).toBe(mockPreset.thumbnailUrl)
    })

    it('should throw error if any preset image fails to load', async () => {
      const failingPreset: PresetConfig = {
        ...mockPreset,
        backgroundUrl: 'https://example.com/fail-background.jpg',
      }

      await expect(imageLoader.loadPresetImages(failingPreset)).rejects.toThrow()
    })
  })

  describe('loadRenderImages', () => {
    it('should load only background and filter images', async () => {
      const result = await imageLoader.loadRenderImages(mockPreset)

      expect(result.background).toBeDefined()
      expect(result.filter).toBeDefined()
      expect(result.background.src).toBe(mockPreset.backgroundUrl)
      expect(result.filter.src).toBe(mockPreset.filterUrl)
    })
  })

  describe('preloadThumbnails', () => {
    it('should preload all preset thumbnails', async () => {
      const presets = [mockPreset, { ...mockPreset, id: 'preset-2', thumbnailUrl: 'https://example.com/thumb2.jpg' }]

      await imageLoader.preloadThumbnails(presets)

      expect(imageLoader.isImageLoaded(mockPreset.thumbnailUrl)).toBe(true)
      expect(imageLoader.isImageLoaded('https://example.com/thumb2.jpg')).toBe(true)
    })

    it('should not throw if some thumbnails fail to load', async () => {
      const presets = [mockPreset, { ...mockPreset, id: 'preset-2', thumbnailUrl: 'https://example.com/fail-thumb.jpg' }]

      // Should not throw
      await expect(imageLoader.preloadThumbnails(presets)).resolves.not.toThrow()
    })
  })

  describe('isImageLoaded', () => {
    it('should return true for loaded images', async () => {
      const url = 'https://example.com/test.jpg'
      await imageLoader.loadImage(url)

      expect(imageLoader.isImageLoaded(url)).toBe(true)
    })

    it('should return false for unloaded images', () => {
      expect(imageLoader.isImageLoaded('https://example.com/unknown.jpg')).toBe(false)
    })
  })

  describe('getImage', () => {
    it('should return loaded image', async () => {
      const url = 'https://example.com/test.jpg'
      const loadedImage = await imageLoader.loadImage(url)

      expect(imageLoader.getImage(url)).toBe(loadedImage)
    })

    it('should return null for unloaded images', () => {
      expect(imageLoader.getImage('https://example.com/unknown.jpg')).toBeNull()
    })
  })

  describe('getLoadedImages', () => {
    it('should return all loaded images', async () => {
      await imageLoader.loadImage('https://example.com/test1.jpg')
      await imageLoader.loadImage('https://example.com/test2.jpg')

      const loadedImages = imageLoader.getLoadedImages()

      expect(loadedImages).toHaveLength(2)
      expect(loadedImages[0]).toHaveProperty('url')
      expect(loadedImages[0]).toHaveProperty('image')
    })
  })

  describe('clearImage', () => {
    it('should remove specific image from cache', async () => {
      const url = 'https://example.com/test.jpg'
      await imageLoader.loadImage(url)

      expect(imageLoader.isImageLoaded(url)).toBe(true)

      imageLoader.clearImage(url)

      expect(imageLoader.isImageLoaded(url)).toBe(false)
    })
  })

  describe('clear', () => {
    it('should remove all images from cache', async () => {
      await imageLoader.loadImage('https://example.com/test1.jpg')
      await imageLoader.loadImage('https://example.com/test2.jpg')

      expect(imageLoader.getLoadedCount()).toBe(2)

      imageLoader.clear()

      expect(imageLoader.getLoadedCount()).toBe(0)
    })
  })
})
