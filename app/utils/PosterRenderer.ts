import type {
  PresetConfig,
  TextAlignment,
  AspectRatio,
  CanvasDimensions,
} from '~/types'
import { CanvasRenderer, CANVAS_DIMENSIONS } from './CanvasRenderer'
import { TextLayoutEngine } from './TextLayoutEngine'

/**
 * Render configuration for poster
 */
export interface RenderConfig {
  preset: PresetConfig
  quoteText: string
  authorText: string
  quoteAlignment: TextAlignment
  authorAlignment: TextAlignment
  filterIntensity: number // 0-100
  aspectRatio: AspectRatio
}

/**
 * PosterRenderer combines CanvasRenderer and TextLayoutEngine
 * to render complete posters
 */
export class PosterRenderer {
  private canvasRenderer: CanvasRenderer
  private textLayoutEngine: TextLayoutEngine
  private currentAspectRatio: AspectRatio

  constructor(canvas: HTMLCanvasElement, aspectRatio: AspectRatio = '1:1') {
    this.canvasRenderer = new CanvasRenderer(canvas, aspectRatio)
    this.textLayoutEngine = new TextLayoutEngine(
      this.canvasRenderer.getContext(),
      CANVAS_DIMENSIONS[aspectRatio]
    )
    this.currentAspectRatio = aspectRatio
  }

  /**
   * Set aspect ratio and update dimensions
   */
  setAspectRatio(aspectRatio: AspectRatio): void {
    if (aspectRatio !== this.currentAspectRatio) {
      this.currentAspectRatio = aspectRatio
      this.canvasRenderer.setCanvasSize(aspectRatio)
      this.textLayoutEngine.setDimensions(CANVAS_DIMENSIONS[aspectRatio])
    }
  }

  /**
   * Get current canvas dimensions
   */
  getDimensions(): CanvasDimensions {
    return this.canvasRenderer.getDimensions()
  }

  /**
   * Render complete poster
   * Property 3: Preset configuration complete application
   */
  render(
    config: RenderConfig,
    backgroundImage: HTMLImageElement,
    filterImage: HTMLImageElement
  ): void {
    const { preset, quoteText, authorText, quoteAlignment, authorAlignment, filterIntensity, aspectRatio } = config

    // Update aspect ratio if changed
    this.setAspectRatio(aspectRatio)

    // Clear canvas
    this.canvasRenderer.clear()

    // Draw background image (cover mode)
    this.canvasRenderer.drawImageCover(backgroundImage)

    // Draw filter overlay with multiply blend mode
    const filterOpacity = filterIntensity / 100
    this.canvasRenderer.drawFilterOverlay(filterImage, filterOpacity)

    // Calculate text layout
    const layout = this.textLayoutEngine.calculateLayout(
      quoteText,
      authorText,
      preset.quoteStyle,
      preset.authorStyle,
      quoteAlignment,
      authorAlignment
    )

    // Render text
    this.textLayoutEngine.renderPosterText(layout)
  }

  /**
   * Render only background and filter (without text)
   * Useful for preview during text editing
   */
  renderBackground(
    backgroundImage: HTMLImageElement,
    filterImage: HTMLImageElement,
    filterIntensity: number
  ): void {
    this.canvasRenderer.clear()
    this.canvasRenderer.drawImageCover(backgroundImage)
    const filterOpacity = filterIntensity / 100
    this.canvasRenderer.drawFilterOverlay(filterImage, filterOpacity)
  }

  /**
   * Render only text (assumes background already rendered)
   * Useful for real-time text preview
   */
  renderText(
    preset: PresetConfig,
    quoteText: string,
    authorText: string,
    quoteAlignment: TextAlignment,
    authorAlignment: TextAlignment
  ): void {
    const layout = this.textLayoutEngine.calculateLayout(
      quoteText,
      authorText,
      preset.quoteStyle,
      preset.authorStyle,
      quoteAlignment,
      authorAlignment
    )
    this.textLayoutEngine.renderPosterText(layout)
  }

  /**
   * Export canvas to data URL
   */
  toDataURL(type: string = 'image/png', quality?: number): string {
    return this.canvasRenderer.toDataURL(type, quality)
  }

  /**
   * Export canvas to Blob
   */
  toBlob(type: string = 'image/png', quality?: number): Promise<Blob | null> {
    return this.canvasRenderer.toBlob(type, quality)
  }

  /**
   * Get the underlying canvas element
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvasRenderer.getCanvas()
  }

  /**
   * Get the 2D rendering context
   */
  getContext(): CanvasRenderingContext2D {
    return this.canvasRenderer.getContext()
  }
}
