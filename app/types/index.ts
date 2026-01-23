/**
 * Typography style configuration for text rendering
 */
export interface TypographyStyle {
  fontFamily: string
  fontWeight: number
  fontStyle: 'normal' | 'italic'
  fontSize: number
  lineHeight: number
  color: string
}

/**
 * Text alignment options
 */
export type TextAlignment = 'left' | 'center' | 'right'

/**
 * Aspect ratio options for canvas
 */
export type AspectRatio = '1:1' | '4:5'

/**
 * Preset style names
 */
export type PresetName = 'Editorial' | 'Classic' | 'Modern'

/**
 * Complete preset configuration
 */
export interface PresetConfig {
  id: string
  name: PresetName
  thumbnailUrl: string
  backgroundUrl: string
  filterUrl: string
  defaultFilterOpacity: number
  quoteStyle: TypographyStyle
  authorStyle: TypographyStyle
  defaultQuoteAlignment: TextAlignment
  defaultAuthorAlignment: TextAlignment
}

/**
 * Canvas dimensions based on aspect ratio
 */
export interface CanvasDimensions {
  width: number
  height: number
}

/**
 * Application state for poster generation
 */
export interface AppState {
  // Current preset
  currentPreset: PresetConfig | null

  // User inputs
  quoteText: string
  authorText: string

  // Style controls
  filterIntensity: number // 0-100
  quoteAlignment: TextAlignment
  authorAlignment: TextAlignment
  aspectRatio: AspectRatio

  // Loading states
  fontsLoaded: boolean
  imagesLoaded: boolean
  isExporting: boolean

  // Error states
  error: string | null
}

/**
 * Export configuration
 */
export interface ExportConfig {
  preset: PresetConfig
  quoteText: string
  authorText: string
  quoteAlignment: TextAlignment
  authorAlignment: TextAlignment
  filterIntensity: number
  aspectRatio: AspectRatio
  dimensions: CanvasDimensions
}

/**
 * Font configuration
 */
export interface FontConfig {
  family: string
  weight: number
  style: 'normal' | 'italic'
  url: string
}

/**
 * Image loading result
 */
export interface LoadedImage {
  url: string
  image: HTMLImageElement
}

/**
 * Text layout calculation result
 */
export interface TextLayout {
  lines: string[]
  totalHeight: number
  lineHeight: number
  x: number
  y: number
}

/**
 * Canvas rendering context
 */
export interface RenderContext {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  dimensions: CanvasDimensions
  backgroundImage: HTMLImageElement
  filterImage: HTMLImageElement
  filterOpacity: number
}
