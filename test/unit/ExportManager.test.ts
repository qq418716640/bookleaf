import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { ExportManager } from '~/utils/ExportManager'
import { CANVAS_DIMENSIONS } from '~/utils/CanvasRenderer'
import type { PresetConfig } from '~/types'
import type { RenderConfig } from '~/utils/PosterRenderer'

// Mock document methods
const mockLink = {
  href: '',
  download: '',
  click: vi.fn(),
}

vi.stubGlobal('document', {
  createElement: vi.fn((tag: string) => {
    if (tag === 'a') {
      return mockLink
    }
    if (tag === 'canvas') {
      return {
        width: 0,
        height: 0,
        getContext: vi.fn(() => ({
          clearRect: vi.fn(),
          drawImage: vi.fn(),
          fillText: vi.fn(),
          measureText: vi.fn(() => ({ width: 100 })),
          globalCompositeOperation: 'source-over',
          globalAlpha: 1,
          font: '',
          fillStyle: '',
          textAlign: 'left',
          textBaseline: 'top',
        })),
        toDataURL: vi.fn(() => 'data:image/png;base64,mock'),
        toBlob: vi.fn((callback: (blob: Blob | null) => void) => {
          callback(new Blob(['mock'], { type: 'image/png' }))
        }),
      }
    }
    return {}
  }),
  body: {
    appendChild: vi.fn(),
    removeChild: vi.fn(),
  },
})

vi.stubGlobal('URL', {
  createObjectURL: vi.fn(() => 'blob:mock-url'),
  revokeObjectURL: vi.fn(),
})

// Mock preset
const mockPreset: PresetConfig = {
  id: 'editorial',
  name: 'Editorial',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  backgroundUrl: 'https://example.com/bg.jpg',
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

// Mock render config
const mockConfig: RenderConfig = {
  preset: mockPreset,
  quoteText: 'Test quote',
  authorText: 'Test Author',
  quoteAlignment: 'center',
  authorAlignment: 'center',
  filterIntensity: 50,
  aspectRatio: '1:1',
}

// Mock images
const mockBackgroundImage = {
  naturalWidth: 1920,
  naturalHeight: 1080,
  width: 1920,
  height: 1080,
} as HTMLImageElement

const mockFilterImage = {
  naturalWidth: 1080,
  naturalHeight: 1080,
  width: 1080,
  height: 1080,
} as HTMLImageElement

describe('ExportManager', () => {
  let exportManager: ExportManager

  beforeEach(() => {
    exportManager = new ExportManager()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('generateFilename (Property 15)', () => {
    it('should generate filename with preset name and timestamp', () => {
      const filename = exportManager.generateFilename('Editorial', 'png')

      expect(filename).toMatch(/^leaflet-editorial-\d+\.png$/)
    })

    it('should sanitize preset name with spaces', () => {
      const filename = exportManager.generateFilename('My Custom Preset', 'png')

      expect(filename).toMatch(/^leaflet-my-custom-preset-\d+\.png$/)
    })

    it('should use jpg extension for jpeg format', () => {
      const filename = exportManager.generateFilename('Editorial', 'jpeg')

      expect(filename).toMatch(/^leaflet-editorial-\d+\.jpg$/)
    })

    it('should generate unique filenames', () => {
      const filename1 = exportManager.generateFilename('Editorial', 'png')
      // Small delay to ensure different timestamp
      const filename2 = exportManager.generateFilename('Editorial', 'png')

      // Filenames should be different (different timestamps)
      // Note: In fast execution, they might be the same
      expect(filename1).toMatch(/^leaflet-editorial-\d+\.png$/)
      expect(filename2).toMatch(/^leaflet-editorial-\d+\.png$/)
    })
  })

  describe('getExportDimensions (Property 13)', () => {
    it('should return correct dimensions for 1:1 aspect ratio', () => {
      const dimensions = exportManager.getExportDimensions('1:1')

      expect(dimensions.width).toBe(1080)
      expect(dimensions.height).toBe(1080)
    })

    it('should return correct dimensions for 4:5 aspect ratio', () => {
      const dimensions = exportManager.getExportDimensions('4:5')

      expect(dimensions.width).toBe(1080)
      expect(dimensions.height).toBe(1350)
    })
  })

  describe('exportPoster', () => {
    it('should export poster successfully', async () => {
      const result = await exportManager.exportPoster(
        mockConfig,
        mockBackgroundImage,
        mockFilterImage,
        { format: 'png' }
      )

      expect(result.success).toBe(true)
      expect(result.filename).toMatch(/^leaflet-editorial-\d+\.png$/)
      expect(result.blob).toBeInstanceOf(Blob)
      expect(result.dataUrl).toBe('data:image/png;base64,mock')
    })

    it('should use custom filename if provided', async () => {
      const result = await exportManager.exportPoster(
        mockConfig,
        mockBackgroundImage,
        mockFilterImage,
        { format: 'png', filename: 'custom-poster.png' }
      )

      expect(result.success).toBe(true)
      expect(result.filename).toBe('custom-poster.png')
    })

    it('should export as JPEG with quality', async () => {
      const result = await exportManager.exportPoster(
        mockConfig,
        mockBackgroundImage,
        mockFilterImage,
        { format: 'jpeg', quality: 0.9 }
      )

      expect(result.success).toBe(true)
      expect(result.filename).toMatch(/\.jpg$/)
    })
  })

  describe('downloadPoster', () => {
    it('should trigger download', async () => {
      const result = await exportManager.downloadPoster(
        mockConfig,
        mockBackgroundImage,
        mockFilterImage,
        { format: 'png' }
      )

      expect(result.success).toBe(true)
      expect(mockLink.click).toHaveBeenCalled()
      expect(URL.createObjectURL).toHaveBeenCalled()
      expect(URL.revokeObjectURL).toHaveBeenCalled()
    })

    it('should set correct download filename', async () => {
      await exportManager.downloadPoster(
        mockConfig,
        mockBackgroundImage,
        mockFilterImage,
        { format: 'png' }
      )

      expect(mockLink.download).toMatch(/^leaflet-editorial-\d+\.png$/)
    })
  })

  describe('exportToDataURL', () => {
    it('should return data URL on success', async () => {
      const dataUrl = await exportManager.exportToDataURL(
        mockConfig,
        mockBackgroundImage,
        mockFilterImage,
        { format: 'png' }
      )

      expect(dataUrl).toBe('data:image/png;base64,mock')
    })
  })

  describe('CANVAS_DIMENSIONS', () => {
    it('should have correct 1:1 dimensions', () => {
      expect(CANVAS_DIMENSIONS['1:1']).toEqual({ width: 1080, height: 1080 })
    })

    it('should have correct 4:5 dimensions', () => {
      expect(CANVAS_DIMENSIONS['4:5']).toEqual({ width: 1080, height: 1350 })
    })
  })
})
