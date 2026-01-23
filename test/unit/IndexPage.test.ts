import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IndexPage from '~/pages/index.vue'

describe('Index Page', () => {
  describe('SEO Meta Tags', () => {
    it('renders page with proper structure', () => {
      const wrapper = mount(IndexPage)

      // Check main semantic elements
      expect(wrapper.find('header').exists()).toBe(true)
      expect(wrapper.find('main').exists()).toBe(true)
      expect(wrapper.find('footer').exists()).toBe(true)
    })

    it('has proper heading hierarchy', () => {
      const wrapper = mount(IndexPage)

      const h1 = wrapper.find('h1')
      expect(h1.exists()).toBe(true)
      expect(h1.text()).toBe('Leaflet')

      const h2 = wrapper.find('h2')
      expect(h2.exists()).toBe(true)
    })

    it('includes skip to content link', () => {
      const wrapper = mount(IndexPage)

      const skipLink = wrapper.find('a[href="#main-content"]')
      expect(skipLink.exists()).toBe(true)
      expect(skipLink.text()).toContain('Skip to main content')
    })
  })

  describe('Semantic HTML', () => {
    it('uses semantic header element', () => {
      const wrapper = mount(IndexPage)
      expect(wrapper.find('header').exists()).toBe(true)
    })

    it('uses semantic main element with id', () => {
      const wrapper = mount(IndexPage)
      const main = wrapper.find('main')
      expect(main.exists()).toBe(true)
      expect(main.attributes('id')).toBe('main-content')
    })

    it('uses semantic footer element', () => {
      const wrapper = mount(IndexPage)
      expect(wrapper.find('footer').exists()).toBe(true)
    })

    it('uses semantic section elements', () => {
      const wrapper = mount(IndexPage)
      const sections = wrapper.findAll('section')
      expect(sections.length).toBeGreaterThan(0)
    })

    it('uses semantic aside element for control panel', () => {
      const wrapper = mount(IndexPage)
      const aside = wrapper.find('aside')
      expect(aside.exists()).toBe(true)
      expect(aside.attributes('aria-label')).toBe('Control panel')
    })
  })

  describe('Accessibility', () => {
    it('has aria-label on control panel', () => {
      const wrapper = mount(IndexPage)
      const aside = wrapper.find('aside')
      expect(aside.attributes('aria-label')).toBe('Control panel')
    })

    it('has aria-label on canvas preview section', () => {
      const wrapper = mount(IndexPage)
      const section = wrapper.find('section[aria-label="Canvas preview"]')
      expect(section.exists()).toBe(true)
    })

    it('has aria-labelledby on main section', () => {
      const wrapper = mount(IndexPage)
      const section = wrapper.find('section[aria-labelledby="app-title"]')
      expect(section.exists()).toBe(true)
    })

    it('has role="img" on canvas preview placeholder', () => {
      const wrapper = mount(IndexPage)
      const canvasPlaceholder = wrapper.find('[role="img"]')
      expect(canvasPlaceholder.exists()).toBe(true)
      expect(canvasPlaceholder.attributes('aria-label')).toContain('canvas')
    })
  })

  describe('Layout Structure', () => {
    it('renders control panel area', () => {
      const wrapper = mount(IndexPage)
      const aside = wrapper.find('aside')
      expect(aside.exists()).toBe(true)
      expect(aside.classes()).toContain('max-w-[360px]')
    })

    it('renders canvas preview area', () => {
      const wrapper = mount(IndexPage)
      const section = wrapper.find('section[aria-label="Canvas preview"]')
      expect(section.exists()).toBe(true)
    })

    it('uses responsive grid layout', () => {
      const wrapper = mount(IndexPage)
      const grid = wrapper.find('.grid')
      expect(grid.exists()).toBe(true)
      expect(grid.classes()).toContain('lg:grid-cols-[360px_1fr]')
    })
  })

  describe('Content', () => {
    it('displays application title', () => {
      const wrapper = mount(IndexPage)
      expect(wrapper.text()).toContain('Leaflet')
      expect(wrapper.text()).toContain('Make words feel published')
    })

    it('displays descriptive text', () => {
      const wrapper = mount(IndexPage)
      expect(wrapper.text()).toContain('Create Beautiful Text Posters')
      expect(wrapper.text()).toContain('Transform your quotes')
    })

    it('displays copyright in footer', () => {
      const wrapper = mount(IndexPage)
      const footer = wrapper.find('footer')
      expect(footer.text()).toContain('2026 Leaflet')
    })
  })
})
