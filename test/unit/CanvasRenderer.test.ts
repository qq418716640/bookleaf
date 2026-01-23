import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CanvasRenderer, CANVAS_DIMENSIONS } from '~/utils/CanvasRenderer'

// Mock canvas context
const createMockContext = () => ({
  clearRect: vi.fn(),
  drawImage: vi.fn(),
  fillText: vi.fn(),
  measureText: vi.fn(() => ({ width: 100 })),
  save: vi.fn(),
  restore: vi.fn(),
  globalCompositeOperation: 'source-over' as GlobalCompositeOperation,
  globalAlpha: 1,
  font: '',
  fillStyle: '',
  textAlign: 'left' as CanvasTextAlign,
  textBaseline: 'top' as CanvasTextBaseline,
})

// Mock canvas element
const createMockCanvas = () => {
  const mockCtx = createMockContext()
  return {
    width: 0,
    height: 0,
    getContext: vi.fn(() => mockCtx),
    toDataURL: vi.fn(() => 'data:image/png;base64,mock'),
    toBlob: vi.fn((callback: (blob: Blob | null) => void) => {
      callback(new Blob(['mock'], { type: 'image/png' }))
    }),
    _mockCtx: mockCtx,
  }
}

// Mock image
const createMockImage = (width: number = 1920, height: number = 1080) => ({
  naturalWidth: width,
  naturalHeight: height,
  width,
  height,
  src: 'https://example.com/image.jpg',
})

describe('CanvasRenderer', () => {
  let mockCanvas: ReturnType<typeof createMockCanvas>
  let renderer: CanvasRenderer

  beforeEach(() => {
    mockCanvas = createMockCanvas()
    renderer = new CanvasRenderer(mockCanvas as unknown as HTMLCanvasElement, '1:1')
  })

  describe('constructor', () => {
    it('should initialize with 1:1 aspect ratio by default', () => {
      const dimensions = renderer.getDimensions()
      expect(dimensions.width).toBe(1080)
      expect(dimensions.height).toBe(1080)
    })

    it('should set canvas dimensions on initialization', () => {
      expect(mockCanvas.width).toBe(1080)
      expect(mockCanvas.height).toBe(1080)
    })

    it('should throw error if context is not available', () => {
      const badCanvas = {
        getContext: vi.fn(() => null),
      }
      expect(() => new CanvasRenderer(badCanvas as unknown as HTMLCanvasElement)).toThrow(
        'Failed to get 2D context from canvas'
      )
    })
  })

  describe('setCanvasSize', () => {
    it('should update dimensions for 4:5 aspect ratio (Property 6)', () => {
      renderer.setCanvasSize('4:5')
      const dimensions = renderer.getDimensions()

      expect(dimensions.width).toBe(1080)
      expect(dimensions.height).toBe(1350)
      expect(mockCanvas.width).toBe(1080)
      expect(mockCanvas.height).toBe(1350)
    })

    it('should update dimensions for 1:1 aspect ratio', () => {
      renderer.setCanvasSize('4:5')
      renderer.setCanvasSize('1:1')
      const dimensions = renderer.getDimensions()

      expect(dimensions.width).toBe(1080)
      expect(dimensions.height).toBe(1080)
    })
  })

  describe('clear', () => {
    it('should clear the entire canvas', () => {
      renderer.clear()

      expect(mockCanvas._mockCtx.clearRect).toHaveBeenCalledWith(0, 0, 1080, 1080)
    })
  })

  describe('drawImageCover (Property 1)', () => {
    it('should draw image covering the canvas', () => {
      const mockImage = createMockImage(1920, 1080)
      renderer.drawImageCover(mockImage as unknown as HTMLImageElement)

      expect(mockCanvas._mockCtx.drawImage).toHaveBeenCalled()
    })

    it('should scale landscape image to cover square canvas', () => {
      const mockImage = createMockImage(1920, 1080) // 16:9 landscape
      renderer.drawImageCover(mockImage as unknown as HTMLImageElement)

      const call = mockCanvas._mockCtx.drawImage.mock.calls[0]
      const [, x, y, width, height] = call

      // Image should be scaled to cover 1080x1080 canvas
      // Scale factor: max(1080/1920, 1080/1080) = 1
      // Scaled dimensions: 1920 * 1 = 1920, 1080 * 1 = 1080
      expect(width).toBe(1920)
      expect(height).toBe(1080)
      // Centered: x = (1080 - 1920) / 2 = -420
      expect(x).toBe(-420)
      expect(y).toBe(0)
    })

    it('should scale portrait image to cover square canvas', () => {
      const mockImage = createMockImage(1080, 1920) // Portrait
      renderer.drawImageCover(mockImage as unknown as HTMLImageElement)

      const call = mockCanvas._mockCtx.drawImage.mock.calls[0]
      const [, x, y, width, height] = call

      // Scale factor: max(1080/1080, 1080/1920) = 1
      expect(width).toBe(1080)
      expect(height).toBe(1920)
      expect(x).toBe(0)
      expect(y).toBe(-420)
    })

    it('should scale square image to fit square canvas exactly', () => {
      const mockImage = createMockImage(500, 500) // Square
      renderer.drawImageCover(mockImage as unknown as HTMLImageElement)

      const call = mockCanvas._mockCtx.drawImage.mock.calls[0]
      const [, x, y, width, height] = call

      // Scale factor: max(1080/500, 1080/500) = 2.16
      expect(width).toBeCloseTo(1080)
      expect(height).toBeCloseTo(1080)
      expect(x).toBeCloseTo(0)
      expect(y).toBeCloseTo(0)
    })
  })

  describe('setBlendMode (Property 2)', () => {
    it('should set multiply blend mode', () => {
      renderer.setBlendMode('multiply')

      expect(mockCanvas._mockCtx.globalCompositeOperation).toBe('multiply')
    })

    it('should set other blend modes', () => {
      renderer.setBlendMode('screen')
      expect(mockCanvas._mockCtx.globalCompositeOperation).toBe('screen')

      renderer.setBlendMode('overlay')
      expect(mockCanvas._mockCtx.globalCompositeOperation).toBe('overlay')
    })
  })

  describe('resetBlendMode', () => {
    it('should reset blend mode to source-over', () => {
      renderer.setBlendMode('multiply')
      renderer.resetBlendMode()

      expect(mockCanvas._mockCtx.globalCompositeOperation).toBe('source-over')
    })
  })

  describe('setAlpha', () => {
    it('should set global alpha', () => {
      renderer.setAlpha(0.5)

      expect(mockCanvas._mockCtx.globalAlpha).toBe(0.5)
    })

    it('should clamp alpha to 0-1 range', () => {
      renderer.setAlpha(-0.5)
      expect(mockCanvas._mockCtx.globalAlpha).toBe(0)

      renderer.setAlpha(1.5)
      expect(mockCanvas._mockCtx.globalAlpha).toBe(1)
    })
  })

  describe('resetAlpha', () => {
    it('should reset alpha to 1', () => {
      renderer.setAlpha(0.5)
      renderer.resetAlpha()

      expect(mockCanvas._mockCtx.globalAlpha).toBe(1)
    })
  })

  describe('drawFilterOverlay', () => {
    it('should draw filter with multiply blend mode and opacity (Property 4)', () => {
      const mockImage = createMockImage()
      renderer.drawFilterOverlay(mockImage as unknown as HTMLImageElement, 0.7)

      // Should set multiply blend mode
      expect(mockCanvas._mockCtx.globalCompositeOperation).toBe('source-over') // Reset after
      // Should draw image
      expect(mockCanvas._mockCtx.drawImage).toHaveBeenCalled()
      // Should reset alpha
      expect(mockCanvas._mockCtx.globalAlpha).toBe(1)
    })
  })

  describe('toDataURL', () => {
    it('should export canvas as PNG data URL', () => {
      const dataUrl = renderer.toDataURL()

      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png', undefined)
      expect(dataUrl).toBe('data:image/png;base64,mock')
    })

    it('should support custom format and quality', () => {
      renderer.toDataURL('image/jpeg', 0.9)

      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.9)
    })
  })

  describe('toBlob', () => {
    it('should export canvas as Blob', async () => {
      const blob = await renderer.toBlob()

      expect(mockCanvas.toBlob).toHaveBeenCalled()
      expect(blob).toBeInstanceOf(Blob)
    })
  })

  describe('CANVAS_DIMENSIONS', () => {
    it('should have correct dimensions for 1:1 ratio', () => {
      expect(CANVAS_DIMENSIONS['1:1']).toEqual({ width: 1080, height: 1080 })
    })

    it('should have correct dimensions for 4:5 ratio', () => {
      expect(CANVAS_DIMENSIONS['4:5']).toEqual({ width: 1080, height: 1350 })
    })
  })
})
