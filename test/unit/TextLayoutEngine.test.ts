import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TextLayoutEngine } from '~/utils/TextLayoutEngine'
import type { TypographyStyle, CanvasDimensions } from '~/types'

// Mock canvas context
const createMockContext = () => ({
  font: '',
  fillStyle: '',
  textAlign: 'left' as CanvasTextAlign,
  textBaseline: 'top' as CanvasTextBaseline,
  measureText: vi.fn((text: string) => ({
    width: text.length * 10, // Simple mock: 10px per character
  })),
  fillText: vi.fn(),
})

// Test typography styles
const quoteStyle: TypographyStyle = {
  fontFamily: 'Crimson Text',
  fontWeight: 400,
  fontStyle: 'italic',
  fontSize: 48,
  lineHeight: 1.4,
  color: '#1a1a1a',
}

const authorStyle: TypographyStyle = {
  fontFamily: 'Crimson Text',
  fontWeight: 400,
  fontStyle: 'normal',
  fontSize: 24,
  lineHeight: 1.5,
  color: '#333333',
}

const dimensions: CanvasDimensions = {
  width: 1080,
  height: 1080,
}

describe('TextLayoutEngine', () => {
  let mockCtx: ReturnType<typeof createMockContext>
  let engine: TextLayoutEngine

  beforeEach(() => {
    mockCtx = createMockContext()
    engine = new TextLayoutEngine(mockCtx as unknown as CanvasRenderingContext2D, dimensions)
  })

  describe('buildFontString', () => {
    it('should build correct font string', () => {
      const fontString = engine.buildFontString(quoteStyle)

      expect(fontString).toBe('italic 400 48px "Crimson Text"')
    })

    it('should handle normal font style', () => {
      const fontString = engine.buildFontString(authorStyle)

      expect(fontString).toBe('normal 400 24px "Crimson Text"')
    })
  })

  describe('wrapText (Property 8, 19-22)', () => {
    it('should return empty array for empty text', () => {
      const lines = engine.wrapText('', quoteStyle, 800)

      expect(lines).toEqual([])
    })

    it('should return empty array for whitespace-only text', () => {
      const lines = engine.wrapText('   ', quoteStyle, 800)

      expect(lines).toEqual([])
    })

    it('should not wrap short text', () => {
      const lines = engine.wrapText('Hello', quoteStyle, 800)

      expect(lines).toHaveLength(1)
      expect(lines[0]).toBe('Hello')
    })

    it('should wrap long text to multiple lines', () => {
      // With mock measureText (10px per char), 800px max width = 80 chars
      const longText = 'This is a very long text that should be wrapped to multiple lines because it exceeds the maximum width'
      const lines = engine.wrapText(longText, quoteStyle, 200) // 20 chars max

      expect(lines.length).toBeGreaterThan(1)
    })

    it('should preserve words when wrapping', () => {
      const text = 'Hello World'
      const lines = engine.wrapText(text, quoteStyle, 60) // 6 chars max

      // Should wrap at word boundary
      expect(lines).toContain('Hello')
      expect(lines).toContain('World')
    })

    it('should constrain text block width (Property 8)', () => {
      const maxWidth = 500
      const text = 'This is a test sentence for width constraint'
      const lines = engine.wrapText(text, quoteStyle, maxWidth)

      // Each line should fit within maxWidth
      for (const line of lines) {
        const width = line.length * 10 // Mock measurement
        expect(width).toBeLessThanOrEqual(maxWidth)
      }
    })
  })

  describe('calculateTextBlock', () => {
    it('should calculate text block dimensions', () => {
      const block = engine.calculateTextBlock({
        text: 'Hello World',
        style: quoteStyle,
        alignment: 'center',
        maxWidthRatio: 0.75,
      })

      expect(block.lines).toHaveLength(1)
      expect(block.lineHeight).toBe(48 * 1.4) // fontSize * lineHeight
      expect(block.totalHeight).toBe(48 * 1.4) // 1 line
      expect(block.maxWidth).toBe(1080 * 0.75) // 810
      expect(block.alignment).toBe('center')
    })

    it('should calculate multi-line block height', () => {
      // Force multiple lines with small maxWidthRatio
      const block = engine.calculateTextBlock({
        text: 'This is a longer text that will wrap',
        style: quoteStyle,
        alignment: 'left',
        maxWidthRatio: 0.2, // Very narrow
      })

      expect(block.lines.length).toBeGreaterThan(1)
      expect(block.totalHeight).toBe(block.lines.length * block.lineHeight)
    })
  })

  describe('calculateX (Property 5)', () => {
    it('should calculate left alignment X position', () => {
      const maxWidth = 800
      const x = engine.calculateX('left', maxWidth)

      // Block starts at (1080 - 800) / 2 = 140
      expect(x).toBe(140)
    })

    it('should calculate center alignment X position', () => {
      const maxWidth = 800
      const x = engine.calculateX('center', maxWidth)

      // Center of canvas
      expect(x).toBe(540)
    })

    it('should calculate right alignment X position', () => {
      const maxWidth = 800
      const x = engine.calculateX('right', maxWidth)

      // Block starts at 140, right edge at 140 + 800 = 940
      expect(x).toBe(940)
    })
  })

  describe('calculateLayout (Property 9, 10)', () => {
    it('should calculate layout for quote and author', () => {
      const layout = engine.calculateLayout(
        'Test quote',
        'Test Author',
        quoteStyle,
        authorStyle,
        'center',
        'center'
      )

      expect(layout.quote).toBeDefined()
      expect(layout.author).toBeDefined()
      expect(layout.quote.y).toBeDefined()
      expect(layout.author.y).toBeDefined()
    })

    it('should vertically center content (Property 9)', () => {
      const layout = engine.calculateLayout(
        'Short quote',
        'Author',
        quoteStyle,
        authorStyle,
        'center',
        'center'
      )

      // Content should be centered in available space
      const totalHeight = layout.totalHeight
      const centerY = dimensions.height / 2
      const contentCenterY = layout.quote.y + totalHeight / 2

      // Content center should be close to canvas center
      expect(Math.abs(contentCenterY - centerY)).toBeLessThan(100)
    })

    it('should maintain gap between quote and author (Property 10)', () => {
      const layout = engine.calculateLayout(
        'Test quote',
        'Test Author',
        quoteStyle,
        authorStyle,
        'center',
        'center'
      )

      const quoteBottom = layout.quote.y + layout.quote.totalHeight
      const gap = layout.author.y - quoteBottom

      expect(gap).toBe(40) // QUOTE_AUTHOR_GAP constant
    })

    it('should handle empty author text', () => {
      const layout = engine.calculateLayout(
        'Test quote',
        '',
        quoteStyle,
        authorStyle,
        'center',
        'center'
      )

      expect(layout.author.lines).toHaveLength(0)
      expect(layout.author.totalHeight).toBe(0)
    })

    it('should handle empty quote text', () => {
      const layout = engine.calculateLayout(
        '',
        'Test Author',
        quoteStyle,
        authorStyle,
        'center',
        'center'
      )

      expect(layout.quote.lines).toHaveLength(0)
      expect(layout.quote.totalHeight).toBe(0)
    })
  })

  describe('renderTextBlock (Property 7)', () => {
    it('should render text with correct font settings', () => {
      const block = {
        lines: ['Hello', 'World'],
        lineHeight: 67.2,
        totalHeight: 134.4,
        fontSize: 48,
        fontFamily: 'Crimson Text',
        fontWeight: 400,
        fontStyle: 'italic',
        color: '#1a1a1a',
        alignment: 'center' as const,
        maxWidth: 810,
        y: 100,
      }

      engine.renderTextBlock(block)

      expect(mockCtx.font).toBe('italic 400 48px "Crimson Text"')
      expect(mockCtx.fillStyle).toBe('#1a1a1a')
      expect(mockCtx.textAlign).toBe('center')
      expect(mockCtx.fillText).toHaveBeenCalledTimes(2)
    })

    it('should not render empty text block', () => {
      const block = {
        lines: [],
        lineHeight: 67.2,
        totalHeight: 0,
        fontSize: 48,
        fontFamily: 'Crimson Text',
        fontWeight: 400,
        fontStyle: 'italic',
        color: '#1a1a1a',
        alignment: 'center' as const,
        maxWidth: 810,
        y: 100,
      }

      engine.renderTextBlock(block)

      expect(mockCtx.fillText).not.toHaveBeenCalled()
    })

    it('should render lines at correct Y positions', () => {
      const block = {
        lines: ['Line 1', 'Line 2', 'Line 3'],
        lineHeight: 50,
        totalHeight: 150,
        fontSize: 36,
        fontFamily: 'Arial',
        fontWeight: 400,
        fontStyle: 'normal',
        color: '#000000',
        alignment: 'left' as const,
        maxWidth: 800,
        y: 200,
      }

      engine.renderTextBlock(block)

      expect(mockCtx.fillText).toHaveBeenCalledTimes(3)
      // Check Y positions
      expect(mockCtx.fillText).toHaveBeenNthCalledWith(1, 'Line 1', expect.any(Number), 200)
      expect(mockCtx.fillText).toHaveBeenNthCalledWith(2, 'Line 2', expect.any(Number), 250)
      expect(mockCtx.fillText).toHaveBeenNthCalledWith(3, 'Line 3', expect.any(Number), 300)
    })
  })

  describe('setDimensions', () => {
    it('should update dimensions', () => {
      const newDimensions: CanvasDimensions = { width: 1080, height: 1350 }
      engine.setDimensions(newDimensions)

      // Verify by checking calculateX uses new width
      const x = engine.calculateX('center', 800)
      expect(x).toBe(540) // Still center of 1080 width
    })
  })

  describe('measureText', () => {
    it('should measure text with correct font', () => {
      const metrics = engine.measureText('Hello', quoteStyle)

      expect(mockCtx.measureText).toHaveBeenCalledWith('Hello')
      expect(metrics.width).toBe(50) // 5 chars * 10px
    })
  })
})
