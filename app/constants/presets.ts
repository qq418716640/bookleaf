import type { PresetConfig, AspectRatio, CanvasDimensions } from '~/types'

export const FONT_PATHS = {
  'Crimson Text': {
    '600': 'fonts/CrimsonText-SemiBold.ttf',
    '600italic': 'fonts/CrimsonText-SemiBoldItalic.ttf'
  },
  'Averia Serif Libre': {
    '700': 'fonts/AveriaSerifLibre-Bold.ttf',
    '700italic': 'fonts/AveriaSerifLibre-BoldItalic.ttf'
  },
  'New Athena Unicode': {
    '400': 'fonts/EBGaramond-Regular.ttf'
  }
}

export const PRESETS: PresetConfig[] = [
  {
    id: 'editorial',
    name: 'Editorial',
    thumbnailUrl: 'images/preview/Editorial-1350.jpg',
    backgroundUrl: 'images/底纹/Editorial-bg-1350.jpg',
    filterUrl: 'images/滤镜/Editorial-filter-Multiply-1350.jpg',
    defaultFilterOpacity: 50,
    quoteStyle: {
      fontFamily: 'Crimson Text',
      fontWeight: 600,
      fontStyle: 'normal',
      fontSize: 56,
      lineHeight: 1.7,
      color: '#333333'
    },
    authorStyle: {
      fontFamily: 'Crimson Text',
      fontWeight: 600,
      fontStyle: 'italic',
      fontSize: 48,
      lineHeight: 1.7,
      color: '#333333'
    },
    defaultQuoteAlignment: 'left',
    defaultAuthorAlignment: 'right'
  },
  {
    id: 'classic',
    name: 'Classic',
    thumbnailUrl: 'images/preview/Classic-1350.jpg',
    backgroundUrl: 'images/底纹/Classic-bg-1350.jpg',
    filterUrl: 'images/滤镜/Classic-filter-Multiply-1350.jpg',
    defaultFilterOpacity: 50,
    quoteStyle: {
      fontFamily: 'Averia Serif Libre',
      fontWeight: 700,
      fontStyle: 'normal',
      fontSize: 56,
      lineHeight: 1.7,
      color: '#333333'
    },
    authorStyle: {
      fontFamily: 'Averia Serif Libre',
      fontWeight: 700,
      fontStyle: 'italic',
      fontSize: 48,
      lineHeight: 1.7,
      color: '#333333'
    },
    defaultQuoteAlignment: 'left',
    defaultAuthorAlignment: 'right'
  },
  {
    id: 'modern',
    name: 'Modern',
    thumbnailUrl: 'images/preview/Modern-1350.jpg',
    backgroundUrl: 'images/底纹/Modern-bg-1350.jpg',
    filterUrl: 'images/滤镜/Modern-filter-Multiply-1350.jpg',
    defaultFilterOpacity: 50,
    quoteStyle: {
      fontFamily: 'New Athena Unicode',
      fontWeight: 400,
      fontStyle: 'normal',
      fontSize: 52,
      lineHeight: 1.6,
      color: '#333333'
    },
    authorStyle: {
      fontFamily: 'New Athena Unicode',
      fontWeight: 400,
      fontStyle: 'normal',
      fontSize: 40,
      lineHeight: 1.6,
      color: '#333333'
    },
    defaultQuoteAlignment: 'left',
    defaultAuthorAlignment: 'right'
  }
]

export const CANVAS_DIMENSIONS: Record<AspectRatio, CanvasDimensions> = {
  '1:1': { width: 1080, height: 1080 },
  '4:5': { width: 1080, height: 1350 }
}

export const TEXT_AREA_WIDTH_RATIO = 0.75
export const QUOTE_AUTHOR_SPACING_LINES = 1

export const DEFAULTS = {
  PRESET_ID: 'editorial',
  FILTER_INTENSITY: 50,
  ASPECT_RATIO: '1:1' as AspectRatio,
  QUOTE_TEXT: 'Some lines stay with us longer than entire stories.',
  AUTHOR_TEXT: '— anonymous'
}

export function getPresetById(id: string): PresetConfig | undefined {
  return PRESETS.find((preset) => preset.id === id)
}

export function getDefaultPreset(): PresetConfig {
  return PRESETS[0]
}
