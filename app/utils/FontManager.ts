import type { FontConfig } from '~/types'
import { FONT_PATHS } from '~/constants/presets'

/**
 * FontManager handles loading and validation of custom fonts
 * Ensures fonts are loaded before canvas rendering
 */
export class FontManager {
  private loadedFonts: Set<string> = new Set()
  private loadingPromises: Map<string, Promise<void>> = new Map()

  /**
   * Load a single font
   */
  async loadFont(config: FontConfig): Promise<void> {
    const fontKey = this.getFontKey(config.family, config.weight, config.style)

    // Return existing promise if already loading
    if (this.loadingPromises.has(fontKey)) {
      return this.loadingPromises.get(fontKey)!
    }

    // Return immediately if already loaded
    if (this.loadedFonts.has(fontKey)) {
      return Promise.resolve()
    }

    // Create loading promise
    const loadingPromise = this.loadFontInternal(config, fontKey)
    this.loadingPromises.set(fontKey, loadingPromise)

    try {
      await loadingPromise
      this.loadedFonts.add(fontKey)
    } finally {
      this.loadingPromises.delete(fontKey)
    }
  }

  /**
   * Internal font loading implementation
   */
  private async loadFontInternal(config: FontConfig, fontKey: string): Promise<void> {
    try {
      // Create FontFace object
      const fontFace = new FontFace(
        config.family,
        `url(${config.url})`,
        {
          weight: config.weight.toString(),
          style: config.style,
        }
      )

      // Load the font
      const loadedFace = await fontFace.load()

      // Add to document fonts
      document.fonts.add(loadedFace)

      console.log(`Font loaded: ${fontKey}`)
    } catch (error) {
      console.error(`Failed to load font: ${fontKey}`, error)
      throw new Error(`Failed to load font: ${config.family} ${config.weight} ${config.style}`)
    }
  }

  /**
   * Load all fonts required for a preset
   * Since fonts are now loaded via CSS @font-face, we just need to wait for them
   */
  async loadPresetFonts(
    quoteFontFamily: string,
    quoteWeight: number,
    quoteStyle: 'normal' | 'italic',
    authorFontFamily: string,
    authorWeight: number,
    authorStyle: 'normal' | 'italic'
  ): Promise<void> {
    console.log('[FontManager] Waiting for fonts to be ready...')
    console.log('[FontManager] Quote font:', quoteFontFamily, quoteWeight, quoteStyle)
    console.log('[FontManager] Author font:', authorFontFamily, authorWeight, authorStyle)
    
    // Wait for document fonts to be ready
    await this.waitForFonts()
    
    // Mark fonts as loaded
    const quoteKey = this.getFontKey(quoteFontFamily, quoteWeight, quoteStyle)
    const authorKey = this.getFontKey(authorFontFamily, authorWeight, authorStyle)
    
    this.loadedFonts.add(quoteKey)
    this.loadedFonts.add(authorKey)
    
    console.log('[FontManager] Fonts ready:', Array.from(this.loadedFonts))
  }

  /**
   * Get font URL from FONT_PATHS configuration
   */
  private getFontUrl(family: string, style: 'normal' | 'italic'): string | null {
    const fontFamily = FONT_PATHS[family as keyof typeof FONT_PATHS]
    if (!fontFamily) {
      console.warn(`Font family not found in FONT_PATHS: ${family}`)
      return null
    }

    const url = fontFamily[style as keyof typeof fontFamily]
    if (!url) {
      console.warn(`Font style not found: ${family} ${style}`)
      return null
    }

    return url
  }

  /**
   * Generate unique key for font
   */
  private getFontKey(family: string, weight: number, style: string): string {
    return `${family}-${weight}-${style}`
  }

  /**
   * Check if a specific font is loaded
   */
  isFontLoaded(family: string, weight: number, style: 'normal' | 'italic'): boolean {
    const fontKey = this.getFontKey(family, weight, style)
    return this.loadedFonts.has(fontKey)
  }

  /**
   * Wait for all fonts to be ready
   */
  async waitForFonts(): Promise<void> {
    try {
      await document.fonts.ready
      console.log('All fonts ready')
    } catch (error) {
      console.error('Error waiting for fonts:', error)
      throw error
    }
  }

  /**
   * Get all loaded fonts
   */
  getLoadedFonts(): string[] {
    return Array.from(this.loadedFonts)
  }

  /**
   * Clear all loaded fonts (for testing)
   */
  clear(): void {
    this.loadedFonts.clear()
    this.loadingPromises.clear()
  }
}

// Export singleton instance
export const fontManager = new FontManager()
