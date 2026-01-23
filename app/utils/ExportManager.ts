import type {
  PresetConfig,
  TextAlignment,
  AspectRatio,
} from '~/types'
import { PosterRenderer, type RenderConfig } from './PosterRenderer'
import { CANVAS_DIMENSIONS } from './CanvasRenderer'

/**
 * Export options
 */
export interface ExportOptions {
  format: 'png' | 'jpeg'
  quality?: number // 0-1 for JPEG
  filename?: string
}

/**
 * Export result
 */
export interface ExportResult {
  success: boolean
  filename: string
  blob?: Blob
  dataUrl?: string
  error?: string
}

/**
 * ExportManager handles poster export functionality
 * Property 13: Export canvas resolution
 * Property 14: Export PNG format
 * Property 15: Export filename format
 */
export class ExportManager {
  /**
   * Generate filename for export
   * Format: leaflet-{preset}-{timestamp}.{ext}
   */
  generateFilename(presetName: string, format: 'png' | 'jpeg'): string {
    const timestamp = Date.now()
    const sanitizedName = presetName.toLowerCase().replace(/\s+/g, '-')
    const extension = format === 'jpeg' ? 'jpg' : 'png'
    return `leaflet-${sanitizedName}-${timestamp}.${extension}`
  }

  /**
   * Export poster to PNG/JPEG using offscreen canvas
   */
  async exportPoster(
    config: RenderConfig,
    backgroundImage: HTMLImageElement,
    filterImage: HTMLImageElement,
    options: ExportOptions = { format: 'png' }
  ): Promise<ExportResult> {
    const { format, quality, filename } = options

    try {
      // Create offscreen canvas at full resolution
      const dimensions = CANVAS_DIMENSIONS[config.aspectRatio]
      const offscreenCanvas = document.createElement('canvas')
      offscreenCanvas.width = dimensions.width
      offscreenCanvas.height = dimensions.height

      // Create renderer for offscreen canvas
      const renderer = new PosterRenderer(offscreenCanvas, config.aspectRatio)

      // Render poster
      renderer.render(config, backgroundImage, filterImage)

      // Get blob
      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png'
      const blob = await renderer.toBlob(mimeType, quality)

      if (!blob) {
        return {
          success: false,
          filename: '',
          error: 'Failed to create image blob',
        }
      }

      // Generate filename
      const exportFilename = filename || this.generateFilename(config.preset.name, format)

      return {
        success: true,
        filename: exportFilename,
        blob,
        dataUrl: renderer.toDataURL(mimeType, quality),
      }
    } catch (error) {
      return {
        success: false,
        filename: '',
        error: error instanceof Error ? error.message : 'Export failed',
      }
    }
  }

  /**
   * Download poster as file
   */
  async downloadPoster(
    config: RenderConfig,
    backgroundImage: HTMLImageElement,
    filterImage: HTMLImageElement,
    options: ExportOptions = { format: 'png' }
  ): Promise<ExportResult> {
    const result = await this.exportPoster(config, backgroundImage, filterImage, options)

    if (!result.success || !result.blob) {
      return result
    }

    try {
      // Create download link
      const url = URL.createObjectURL(result.blob)
      const link = document.createElement('a')
      link.href = url
      link.download = result.filename

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Cleanup
      URL.revokeObjectURL(url)

      return result
    } catch (error) {
      return {
        success: false,
        filename: result.filename,
        error: error instanceof Error ? error.message : 'Download failed',
      }
    }
  }

  /**
   * Export poster to data URL (for preview or sharing)
   */
  async exportToDataURL(
    config: RenderConfig,
    backgroundImage: HTMLImageElement,
    filterImage: HTMLImageElement,
    options: ExportOptions = { format: 'png' }
  ): Promise<string | null> {
    const result = await this.exportPoster(config, backgroundImage, filterImage, options)
    return result.success ? result.dataUrl || null : null
  }

  /**
   * Get export dimensions for aspect ratio
   */
  getExportDimensions(aspectRatio: AspectRatio): { width: number; height: number } {
    return CANVAS_DIMENSIONS[aspectRatio]
  }
}

// Export singleton instance
export const exportManager = new ExportManager()
