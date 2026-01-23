import type {
  CanvasDimensions,
  TextAlignment,
  TypographyStyle,
  AspectRatio,
} from '~/types'

/**
 * Canvas dimensions for different aspect ratios
 */
export const CANVAS_DIMENSIONS: Record<AspectRatio, CanvasDimensions> = {
  '1:1': { width: 1080, height: 1080 },
  '4:5': { width: 1080, height: 1350 },
}

/**
 * Text layout configuration
 */
export interface TextConfig {
  text: string
  style: TypographyStyle
  alignment: TextAlignment
  maxWidth: number
  y: number
}

/**
 * CanvasRenderer handles all canvas drawing operations
 * for the poster generator
 */
export class CanvasRenderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private dimensions: CanvasDimensions

  constructor(canvas: HTMLCanvasElement, aspectRatio: AspectRatio = '1:1') {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Failed to get 2D context from canvas')
    }
    this.ctx = ctx
    this.dimensions = CANVAS_DIMENSIONS[aspectRatio]
    this.setCanvasSize(aspectRatio)
  }

  /**
   * Set canvas size based on aspect ratio
   */
  setCanvasSize(aspectRatio: AspectRatio): void {
    this.dimensions = CANVAS_DIMENSIONS[aspectRatio]
    this.canvas.width = this.dimensions.width
    this.canvas.height = this.dimensions.height
  }

  /**
   * Get current canvas dimensions
   */
  getDimensions(): CanvasDimensions {
    return { ...this.dimensions }
  }

  /**
   * Clear the entire canvas
   */
  clear(): void {
    this.ctx.clearRect(0, 0, this.dimensions.width, this.dimensions.height)
  }

  /**
   * Draw image with cover mode (fills canvas while maintaining aspect ratio)
   * Property 1: Cover scaling fills canvas
   */
  drawImageCover(image: HTMLImageElement): void {
    const { width: canvasWidth, height: canvasHeight } = this.dimensions
    const imageWidth = image.naturalWidth || image.width
    const imageHeight = image.naturalHeight || image.height

    // Calculate scale to cover the canvas
    const scaleX = canvasWidth / imageWidth
    const scaleY = canvasHeight / imageHeight
    const scale = Math.max(scaleX, scaleY)

    // Calculate dimensions after scaling
    const scaledWidth = imageWidth * scale
    const scaledHeight = imageHeight * scale

    // Center the image
    const x = (canvasWidth - scaledWidth) / 2
    const y = (canvasHeight - scaledHeight) / 2

    this.ctx.drawImage(image, x, y, scaledWidth, scaledHeight)
  }

  /**
   * Set blend mode for subsequent drawing operations
   * Property 2: Multiply blend mode application
   */
  setBlendMode(mode: GlobalCompositeOperation): void {
    this.ctx.globalCompositeOperation = mode
  }

  /**
   * Reset blend mode to default
   */
  resetBlendMode(): void {
    this.ctx.globalCompositeOperation = 'source-over'
  }

  /**
   * Set global alpha for subsequent drawing operations
   */
  setAlpha(alpha: number): void {
    this.ctx.globalAlpha = Math.max(0, Math.min(1, alpha))
  }

  /**
   * Reset global alpha to default
   */
  resetAlpha(): void {
    this.ctx.globalAlpha = 1
  }

  /**
   * Draw filter overlay with multiply blend mode
   */
  drawFilterOverlay(filterImage: HTMLImageElement, opacity: number): void {
    this.setBlendMode('multiply')
    this.setAlpha(opacity)
    this.drawImageCover(filterImage)
    this.resetAlpha()
    this.resetBlendMode()
  }

  /**
   * Get the 2D rendering context
   */
  getContext(): CanvasRenderingContext2D {
    return this.ctx
  }

  /**
   * Get the canvas element
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas
  }

  /**
   * Export canvas to data URL
   */
  toDataURL(type: string = 'image/png', quality?: number): string {
    return this.canvas.toDataURL(type, quality)
  }

  /**
   * Export canvas to Blob
   */
  toBlob(type: string = 'image/png', quality?: number): Promise<Blob | null> {
    return new Promise((resolve) => {
      this.canvas.toBlob(resolve, type, quality)
    })
  }
}
