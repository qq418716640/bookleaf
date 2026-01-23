import type { PresetConfig, AspectRatio, CanvasDimensions } from '~/types'

/**
 * Preset configurations for Editorial, Classic, and Modern styles
 * Based on Bookleaf Embedded App document
 */
export const PRESETS: PresetConfig[] = [
  {
    id: 'editorial',
    name: 'Editorial',
    thumbnailUrl: 'https://i