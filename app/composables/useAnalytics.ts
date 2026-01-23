// Umami Analytics composable
// Based on Bookleaf 数据埋点规范

// 类型定义
interface AnalyticsEvent {
  eventName: string
  params?: Record<string, any>
}

// 检测umami是否可用
const isUmamiAvailable = (): boolean => {
  return typeof window !== 'undefined' && 'umami' in window
}

// 发送事件
const trackEvent = (eventName: string, params?: Record<string, any>): void => {
  if (isUmamiAvailable()) {
    // 使用umami的track方法发送事件
    ;(window as any).umami(eventName, params)
  } else {
    // 开发环境下的日志
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', eventName, params)
    }
  }
}

// 页面级事件
export const trackPageView = (sourcePage: string): void => {
  trackEvent('page_view', { source_page: sourcePage })
}

export const trackScroll50 = (sourcePage: string): void => {
  trackEvent('scroll_50', { source_page: sourcePage })
}

export const trackScroll90 = (sourcePage: string): void => {
  trackEvent('scroll_90', { source_page: sourcePage })
}

// Hero区事件
export const trackClickTryBookleaf = (heroVariant: string): void => {
  trackEvent('click_try_bookleaf', { hero_variant: heroVariant })
}

export const trackClickExamples = (heroVariant: string): void => {
  trackEvent('click_examples', { hero_variant: heroVariant })
}

// Embedded App关键事件
export const trackAppVisible = (deviceType: string): void => {
  trackEvent('app_visible', { device_type: deviceType })
}

export const trackPresetSelected = (preset: string): void => {
  trackEvent('preset_selected', { preset })
}

export const trackRatioSelected = (ratio: string): void => {
  trackEvent('ratio_selected', { ratio })
}

export const trackStyleStrengthChanged = (value: number): void => {
  trackEvent('style_strength_changed', { value })
}

// 导出相关事件
export const trackClickExport = (preset: string, ratio: string): void => {
  trackEvent('click_export', { preset, ratio })
}

export const trackExportSuccess = (fileSize: number): void => {
  trackEvent('export_success', { file_size: fileSize })
}

export const trackExportFailed = (errorReason: string): void => {
  trackEvent('export_failed', { error_reason: errorReason })
}

// 导航与引流事件
export const trackClickGoPro = (): void => {
  trackEvent('click_go_pro', { destination: 'ai_tools' })
}

export const trackClickInspiration = (): void => {
  trackEvent('click_inspiration', { source: 'gallery' })
}

// FAQ交互事件
export const trackFaqExpand = (question: string): void => {
  trackEvent('faq_expand', { question })
}

export const trackFaqCollapse = (question: string): void => {
  trackEvent('faq_collapse', { question })
}

// 设备类型检测
export const getDeviceType = (): string => {
  if (typeof window === 'undefined') return 'unknown'
  
  const width = window.innerWidth
  if (width >= 1024) return 'desktop'
  if (width >= 768) return 'tablet'
  return 'mobile'
}

// 滚动事件监听
export const setupScrollTracking = (sourcePage: string): void => {
  if (typeof window === 'undefined') return
  
  let hasTracked50 = false
  let hasTracked90 = false
  
  const handleScroll = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight
    const winHeight = window.innerHeight
    const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100
    
    if (scrollPercent >= 50 && !hasTracked50) {
      trackScroll50(sourcePage)
      hasTracked50 = true
    }
    
    if (scrollPercent >= 90 && !hasTracked90) {
      trackScroll90(sourcePage)
      hasTracked90 = true
    }
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true })
  
  // 清理函数
  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}

// 主composable
export default function useAnalytics() {
  return {
    // 页面级事件
    trackPageView,
    trackScroll50,
    trackScroll90,
    setupScrollTracking,
    
    // Hero区事件
    trackClickTryBookleaf,
    trackClickExamples,
    
    // Embedded App关键事件
    trackAppVisible,
    trackPresetSelected,
    trackRatioSelected,
    trackStyleStrengthChanged,
    
    // 导出相关事件
    trackClickExport,
    trackExportSuccess,
    trackExportFailed,
    
    // 导航与引流事件
    trackClickGoPro,
    trackClickInspiration,
    
    // FAQ交互事件
    trackFaqExpand,
    trackFaqCollapse,
    
    // 工具函数
    getDeviceType,
    isUmamiAvailable,
  }
}
