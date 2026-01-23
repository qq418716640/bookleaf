import type {
  TypographyStyle,
  TextAlignment,
  CanvasDimensions,
  TextLayout,
} from '~/types'

/**
 * Text block configuration
 */
export interface TextBlockConfig {
  text: string
  style: TypographyStyle
  alignment: TextAlignment
  maxWidthRatio: number // Ratio of canvas width (e.g., 0.8 = 80%)
}

/**
 * Rendered text block result
 */
export interface TextBlock {
  lines: string[]
  lineHeight: number
  totalHeight: number
  fontSize: number
  fontFamily: string
  fontWeight: number
  fontStyle: string
  color: string
  alignment: TextAlignment
  maxWidth: number
}

/**
 * Layout result for quote and author
 */
export interface PosterTextLayout {
  quote: TextBlock & { y: number }
  author: TextBlock & { y: number }
  totalHeight: number
}

/**
 * TextLayoutEngine handles text wrapping and positioning
 * for the poster generator
 */
export class TextLayoutEngine {
  private ctx: CanvasRenderingContext2D
  private dimensions: CanvasDimensions

  // Layout constants
  private readonly QUOTE_MAX_WIDTH_RATIO = 0.75 // 75% of canvas width
  private readonly AUTHOR_MAX_WIDTH_RATIO = 0.6 // 60% of canvas width
  private readonly QUOTE_AUTHOR_GAP = 40 // Gap between quote and author in pixels
  private readonly VERTICAL_PADDING = 100 // Top/bottom padding

  constructor(ctx: CanvasRenderingContext2D, dimensions: CanvasDimensions) {
    this.ctx = ctx
    this.dimensions = dimensions
  }

  /**
   * Update dimensions (when aspect ratio changes)
   */
  setDimensions(dimensions: CanvasDimensions): void {
    this.dimensions = dimensions
  }

  /**
   * Build font string for canvas context
   */
  buildFontString(style: TypographyStyle): string {
    return `${style.fontStyle} ${style.fontWeight} ${style.fontSize}px "${style.fontFamily}"`
  }

  /**
   * Wrap text to fit within max width
   * Property 8: Text block width constraint
   */
  wrapText(text: string, style: TypographyStyle, maxWidth: number): string[] {
    if (!text.trim()) return []

    this.ctx.font = this.buildFontString(style)

    const words = text.split(/\s+/)
    const lines: string[] = []
    let currentLine = ''

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const metrics = this.ctx.measureText(testLine)

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }

    if (currentLine) {
      lines.push(currentLine)
    }

    return lines
  }

  /**
   * Calculate text block dimensions
   */
  calculateTextBlock(config: TextBlockConfig): TextBlock {
    const maxWidth = this.dimensions.width * config.maxWidthRatio
    const lines = this.wrapText(config.text, config.style, maxWidth)
    const lineHeight = config.style.fontSize * config.style.lineHeight
    const totalHeight = lines.length * lineHeight

    return {
      lines,
      lineHeight,
      totalHeight,
      fontSize: config.style.fontSize,
      fontFamily: config.style.fontFamily,
      fontWeight: config.style.fontWeight,
      fontStyle: config.style.fontStyle,
      color: config.style.color,
      alignment: config.alignment,
      maxWidth,
    }
  }

  /**
   * Calculate X position based on alignment
   * Property 5: Text alignment application
   */
  calculateX(alignment: TextAlignment, maxWidth: number): number {
    const canvasWidth = this.dimensions.width
    const blockStartX = (canvasWidth - maxWidth) / 2

    switch (alignment) {
      case 'left':
        return blockStartX
      case 'center':
        return canvasWidth / 2
      case 'right':
        return blockStartX + maxWidth
      default:
        return canvasWidth / 2
    }
  }

  /**
   * Calculate complete layout for quote and author
   * Property 9: Text block vertical centering
   * Property 10: Quote and Author spacing
   */
  calculateLayout(
    quoteText: string,
    authorText: string,
    quoteStyle: TypographyStyle,
    authorStyle: TypographyStyle,
    quoteAlignment: TextAlignment,
    authorAlignment: TextAlignment
  ): PosterTextLayout {
    // Calculate quote block
    const quoteBlock = this.calculateTextBlock({
      text: quoteText,
      style: quoteStyle,
      alignment: quoteAlignment,
      maxWidthRatio: this.QUOTE_MAX_WIDTH_RATIO,
    })

    // Calculate author block
    const authorBlock = this.calculateTextBlock({
      text: authorText,
      style: authorStyle,
      alignment: authorAlignment,
      maxWidthRatio: this.AUTHOR_MAX_WIDTH_RATIO,
    })

    // Calculate total content height
    const gap = authorText.trim() ? this.QUOTE_AUTHOR_GAP : 0
    const totalContentHeight = quoteBlock.totalHeight + gap + authorBlock.totalHeight

    // Calculate vertical centering
    const availableHeight = this.dimensions.height - 2 * this.VERTICAL_PADDING
    const startY = this.VERTICAL_PADDING + (availableHeight - totalContentHeight) / 2

    // Position quote
    const quoteY = startY

    // Position author (below quote with gap)
    const authorY = quoteY + quoteBlock.totalHeight + gap

    return {
      quote: { ...quoteBlock, y: quoteY },
      author: { ...authorBlock, y: authorY },
      totalHeight: totalContentHeight,
    }
  }

  /**
   * Render text block to canvas
   * Property 7: Typography configuration application
   */
  renderTextBlock(block: TextBlock & { y: number }): void {
    if (block.lines.length === 0) return

    // Set font
    this.ctx.font = `${block.fontStyle} ${block.fontWeight} ${block.fontSize}px "${block.fontFamily}"`
    this.ctx.fillStyle = block.color
    this.ctx.textBaseline = 'top'

    // Set text alignment
    this.ctx.textAlign = block.alignment

    // Calculate X position
    const x = this.calculateX(block.alignment, block.maxWidth)

    // Render each line
    let currentY = block.y
    for (const line of block.lines) {
      this.ctx.fillText(line, x, currentY)
      currentY += block.lineHeight
    }
  }

  /**
   * Render complete poster text (quote + author)
   */
  renderPosterText(layout: PosterTextLayout): void {
    this.renderTextBlock(layout.quote)
    this.renderTextBlock(layout.author)
  }

  /**
   * Get text metrics for a string
   */
  measureText(text: string, style: TypographyStyle): TextMetrics {
    this.ctx.font = this.buildFontString(style)
    return this.ctx.measureText(text)
  }
}
