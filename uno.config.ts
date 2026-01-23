import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,600,700',
        mono: 'Fira Code:400,600',
        crimson: [
          {
            name: 'Crimson Text',
            weights: ['600'],
            italic: true,
          },
        ],
        averia: [
          {
            name: 'Averia Serif Libre',
            weights: ['700'],
            italic: true,
          },
        ],
        athena: [
          {
            name: 'EB Garamond',
            weights: ['400'],
          },
        ],
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  // 添加基础样式重置，确保所有标签默认没有 margin 和 padding
  preflights: [
    {
      layer: 'base',
      getCSS: () => `
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        html, body {
          margin: 0;
          padding: 0;
        }
        
        h1, h2, h3, h4, h5, h6 {
          margin: 0;
          padding: 0;
        }
        
        p {
          margin: 0;
          padding: 0;
        }
        
        ul, ol {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        
        a {
          text-decoration: none;
          color: inherit;
        }
        
        button, input, select, textarea {
          margin: 0;
          padding: 0;
          border: none;
          outline: none;
          background: none;
          font-family: inherit;
          font-size: inherit;
          color: inherit;
        }
      `,
    },
  ],
  theme: {
    // 颜色系统 - Bookleaf Theme
    colors: {
      // 主色 - 使用#484C44
      primary: {
        50: '#f8f8f7',
        100: '#e9e9e7',
        200: '#d1d1cb',
        300: '#b4b4aa',
        400: '#949487',
        500: '#7a7a6c',
        600: '#636356',
        700: '#484c44',
        800: '#3a3d36',
        900: '#2f312c',
      },
      // 辅助色 - 使用#849975
      secondary: {
        50: '#f6f8f4',
        100: '#e8ede2',
        200: '#d4ddd0',
        300: '#bbc4b3',
        400: '#a2b099',
        500: '#849975',
        600: '#6d8060',
        700: '#58674d',
        800: '#46513e',
        900: '#384032',
      },
      // 中性色 - 使用#475569
      neutral: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
      // 背景色 - 使用#ECE7DF
      background: '#ECE7DF',
      // 语义色
      success: {
        50: '#f0fdf4',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
      },
      warning: {
        50: '#fffbeb',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
      },
      error: {
        50: '#fef2f2',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
      },
    },
    // 间距系统 (4px 基准，8px 网格)
    spacing: {
      0: '0',
      0.5: '0.125rem', // 2px
      1: '0.25rem', // 4px
      1.5: '0.375rem', // 6px
      2: '0.5rem', // 8px
      2.5: '0.625rem', // 10px
      3: '0.75rem', // 12px
      3.5: '0.875rem', // 14px
      4: '1rem', // 16px
      5: '1.25rem', // 20px
      6: '1.5rem', // 24px
      7: '1.75rem', // 28px
      8: '2rem', // 32px
      9: '2.25rem', // 36px
      10: '2.5rem', // 40px
      11: '2.75rem', // 44px
      12: '3rem', // 48px
      14: '3.5rem', // 56px
      16: '4rem', // 64px
      20: '5rem', // 80px
      24: '6rem', // 96px
      28: '7rem', // 112px
      32: '8rem', // 128px
      36: '9rem', // 144px
      40: '10rem', // 160px
      44: '11rem', // 176px
      48: '12rem', // 192px
      52: '13rem', // 208px
      56: '14rem', // 224px
      60: '15rem', // 240px
      64: '16rem', // 256px
      72: '18rem', // 288px
      80: '20rem', // 320px
      96: '24rem', // 384px
    },
    // 字体系统
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Crimson Text', 'Georgia', 'serif'],
      mono: ['Fira Code', 'monospace'],
    },
    
    // 字体大小和行高系统
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }], // 12px
      sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
      base: ['1rem', { lineHeight: '1.5rem' }], // 16px
      lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
      xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
      '5xl': ['3rem', { lineHeight: '1' }], // 48px
      '6xl': ['3.75rem', { lineHeight: '1' }], // 60px
      '7xl': ['4.5rem', { lineHeight: '1' }], // 72px
      '8xl': ['6rem', { lineHeight: '1' }], // 96px
      '9xl': ['8rem', { lineHeight: '1' }], // 128px
    },
    // 断点（响应式设计）
    breakpoints: {
      xs: '320px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    // 阴影 - Soft shadows for Bookleaf theme
    boxShadow: {
      sm: '0 1px 2px 0 rgb(146 139 134 / 0.05)',
      DEFAULT: '0 1px 3px 0 rgb(146 139 134 / 0.08), 0 1px 2px -1px rgb(146 139 134 / 0.08)',
      md: '0 4px 6px -1px rgb(146 139 134 / 0.08), 0 2px 4px -2px rgb(146 139 134 / 0.08)',
      lg: '0 10px 15px -3px rgb(146 139 134 / 0.1), 0 4px 6px -4px rgb(146 139 134 / 0.1)',
      xl: '0 20px 25px -5px rgb(146 139 134 / 0.12), 0 8px 10px -6px rgb(146 139 134 / 0.12)',
      '2xl': '0 25px 50px -12px rgb(146 139 134 / 0.2)',
      soft: '0 8px 30px rgb(146 139 134 / 0.12)',
      inner: 'inset 0 2px 4px 0 rgb(146 139 134 / 0.05)',
      none: 'none',
    },
    // 圆角
    borderRadius: {
      none: '0',
      sm: '0.125rem', // 2px
      DEFAULT: '0.25rem', // 4px
      md: '0.375rem', // 6px
      lg: '0.5rem', // 8px
      xl: '0.75rem', // 12px
      '2xl': '1rem', // 16px
      '3xl': '1.5rem', // 24px
      full: '9999px',
    },
  },
  // 添加像素单位支持，让 px-1 映射为 1px (优先级高于默认系统)
  rules: [
    // 添加 p- 数值单位规则，直接映射到像素（全方向padding）
    [/^p-(\d+)$/, ([_, num]) => ({ 'padding': `${num}px` }), { layer: 'pixel-units' }],
    // 添加 px- 数值单位规则，直接映射到像素
    [/^px-(\d+)$/, ([_, num]) => ({ 'padding-left': `${num}px`, 'padding-right': `${num}px` }), { layer: 'pixel-units' }],
    [/^py-(\d+)$/, ([_, num]) => ({ 'padding-top': `${num}px`, 'padding-bottom': `${num}px` }), { layer: 'pixel-units' }],
    [/^pt-(\d+)$/, ([_, num]) => ({ 'padding-top': `${num}px` }), { layer: 'pixel-units' }],
    [/^pr-(\d+)$/, ([_, num]) => ({ 'padding-right': `${num}px` }), { layer: 'pixel-units' }],
    [/^pb-(\d+)$/, ([_, num]) => ({ 'padding-bottom': `${num}px` }), { layer: 'pixel-units' }],
    [/^pl-(\d+)$/, ([_, num]) => ({ 'padding-left': `${num}px` }), { layer: 'pixel-units' }],
    // 添加 m- 数值单位规则，直接映射到像素（全方向margin）
    [/^m-(\d+)$/, ([_, num]) => ({ 'margin': `${num}px` }), { layer: 'pixel-units' }],
    [/^mx-(\d+)$/, ([_, num]) => ({ 'margin-left': `${num}px`, 'margin-right': `${num}px` }), { layer: 'pixel-units' }],
    [/^my-(\d+)$/, ([_, num]) => ({ 'margin-top': `${num}px`, 'margin-bottom': `${num}px` }), { layer: 'pixel-units' }],
    [/^mt-(\d+)$/, ([_, num]) => ({ 'margin-top': `${num}px` }), { layer: 'pixel-units' }],
    [/^mr-(\d+)$/, ([_, num]) => ({ 'margin-right': `${num}px` }), { layer: 'pixel-units' }],
    [/^mb-(\d+)$/, ([_, num]) => ({ 'margin-bottom': `${num}px` }), { layer: 'pixel-units' }],
    [/^ml-(\d+)$/, ([_, num]) => ({ 'margin-left': `${num}px` }), { layer: 'pixel-units' }],
    [/^gap-(\d+)$/, ([_, num]) => ({ 'gap': `${num}px` }), { layer: 'pixel-units' }],
    [/^space-x-(\d+)$/, ([_, num]) => ({ '--un-space-x-reverse': '0', 'margin-left': `${num}px`, 'margin-right': `-${num}px` }), { layer: 'pixel-units' }],
    [/^space-y-(\d+)$/, ([_, num]) => ({ '--un-space-y-reverse': '0', 'margin-top': `${num}px`, 'margin-bottom': `-${num}px` }), { layer: 'pixel-units' }],
    // 添加 text- 数值单位规则，直接映射到像素字体大小
    [/^text-(\d+)$/, ([_, num]) => ({ 'font-size': `${num}px` }), { layer: 'pixel-units' }],
    // 添加 leading- 数值单位规则，直接映射到像素行高
    [/^leading-(\d+)$/, ([_, num]) => ({ 'line-height': `${num}px` }), { layer: 'pixel-units' }],
    // 添加宽度和高度单位规则，直接映射到像素
    [/^w-(\d+)$/, ([_, num]) => ({ 'width': `${num}px` }), { layer: 'pixel-units' }],
    [/^h-(\d+)$/, ([_, num]) => ({ 'height': `${num}px` }), { layer: 'pixel-units' }],
    [/^min-w-(\d+)$/, ([_, num]) => ({ 'min-width': `${num}px` }), { layer: 'pixel-units' }],
    [/^max-w-(\d+)$/, ([_, num]) => ({ 'max-width': `${num}px` }), { layer: 'pixel-units' }],
    [/^min-h-(\d+)$/, ([_, num]) => ({ 'min-height': `${num}px` }), { layer: 'pixel-units' }],
    [/^max-h-(\d+)$/, ([_, num]) => ({ 'max-height': `${num}px` }), { layer: 'pixel-units' }],
    // 添加边框单位规则，直接映射到像素
    [/^border-(\d+)$/, ([_, num]) => ({ 'border-width': `${num}px` }), { layer: 'pixel-units' }],
    [/^border-t-(\d+)$/, ([_, num]) => ({ 'border-top-width': `${num}px` }), { layer: 'pixel-units' }],
    [/^border-r-(\d+)$/, ([_, num]) => ({ 'border-right-width': `${num}px` }), { layer: 'pixel-units' }],
    [/^border-b-(\d+)$/, ([_, num]) => ({ 'border-bottom-width': `${num}px` }), { layer: 'pixel-units' }],
    [/^border-l-(\d+)$/, ([_, num]) => ({ 'border-left-width': `${num}px` }), { layer: 'pixel-units' }],
    // 添加圆角单位规则，直接映射到像素
    [/^rounded-(\d+)$/, ([_, num]) => ({ 'border-radius': `${num}px` }), { layer: 'pixel-units' }],
    [/^rounded-t-(\d+)$/, ([_, num]) => ({ 'border-top-left-radius': `${num}px`, 'border-top-right-radius': `${num}px` }), { layer: 'pixel-units' }],
    [/^rounded-r-(\d+)$/, ([_, num]) => ({ 'border-top-right-radius': `${num}px`, 'border-bottom-right-radius': `${num}px` }), { layer: 'pixel-units' }],
    [/^rounded-b-(\d+)$/, ([_, num]) => ({ 'border-bottom-left-radius': `${num}px`, 'border-bottom-right-radius': `${num}px` }), { layer: 'pixel-units' }],
    [/^rounded-l-(\d+)$/, ([_, num]) => ({ 'border-top-left-radius': `${num}px`, 'border-bottom-left-radius': `${num}px` }), { layer: 'pixel-units' }],
    [/^rounded-tl-(\d+)$/, ([_, num]) => ({ 'border-top-left-radius': `${num}px` }), { layer: 'pixel-units' }],
    [/^rounded-tr-(\d+)$/, ([_, num]) => ({ 'border-top-right-radius': `${num}px` }), { layer: 'pixel-units' }],
    [/^rounded-br-(\d+)$/, ([_, num]) => ({ 'border-bottom-right-radius': `${num}px` }), { layer: 'pixel-units' }],
    [/^rounded-bl-(\d+)$/, ([_, num]) => ({ 'border-bottom-left-radius': `${num}px` }), { layer: 'pixel-units' }],
    // 添加过渡时间单位规则，直接映射到毫秒
    [/^duration-(\d+)$/, ([_, num]) => ({ 'transition-duration': `${num}ms` }), { layer: 'pixel-units' }],
    [/^delay-(\d+)$/, ([_, num]) => ({ 'transition-delay': `${num}ms` }), { layer: 'pixel-units' }],
  ],
  layers: {
    'pixel-units': -10, // 设置较低的优先级，让像素单位可以被更明确的选择器覆盖
  },
  shortcuts: {
    // 按钮基础样式 - Soft Bookleaf UI
    'btn-base':
      'px-24 py-12 rounded-full font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-soft',
    'btn-primary': 'btn-base bg-primary-700 text-white hover:bg-primary-800 shadow-lg hover:shadow-xl',
    'btn-secondary':
      'btn-base bg-secondary-500 text-white hover:bg-secondary-600 shadow-lg hover:shadow-xl',
    'btn-ghost':
      'btn-base bg-white/80 backdrop-blur-sm text-secondary-700 hover:bg-white hover:shadow-md',
    'btn-danger': 'btn-base bg-error-500 text-white hover:bg-error-600',
    // 按钮尺寸
    'btn-sm': 'px-12 py-6 text-sm',
    'btn-md': 'px-16 py-8 text-base',
    'btn-lg': 'px-24 py-12 text-lg',
    // 输入框样式
    'input-base':
      'w-full px-12 py-4 border border-neutral-300 rounded-lg outline outline-1 outline-color-[#484c44] focus:outline-2 focus:outline-color-[#484c44] focus:ring-0 transition-all disabled:bg-neutral-100 disabled:cursor-not-allowed',
    'input-error': 'border-error-500 focus:ring-error-500',
    // 卡片样式 - Soft UI
    'card-base': 'bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft p-12 border border-neutral-100',
    'card-hover': 'card-base hover:shadow-lg hover:scale-102 transition-all duration-300 cursor-pointer',
    'card-glass': 'bg-white/60 backdrop-blur-md rounded-3xl shadow-soft p-12 border border-white/40',
    // 布局快捷方式
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'flex-start': 'flex items-center justify-start',
    'flex-end': 'flex items-center justify-end',
    'grid-cols-auto': 'grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))]',
    // 容器
    'container-base': 'mx-auto px-16 sm:px-24 lg:px-32',
    'container-narrow': 'max-w-screen-md mx-auto px-16',
    'container-wide': 'max-w-screen-2xl mx-auto px-16',
  },
  safelist: [
    'i-carbon-checkmark', 
    'i-carbon-close', 
    'i-carbon-warning',
    'scale-105',
    'scale-110',
    'transform',
    'hover:scale-[1.02]',
  ],
})
