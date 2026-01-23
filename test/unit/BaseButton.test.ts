import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '~/components/base/BaseButton.vue'

describe('BaseButton', () => {
  describe('Variants', () => {
    it('renders primary variant correctly', () => {
      const wrapper = mount(BaseButton, {
        props: { variant: 'primary' },
        slots: { default: 'Click me' },
      })

      expect(wrapper.classes()).toContain('btn-primary')
      expect(wrapper.text()).toBe('Click me')
    })

    it('renders secondary variant correctly', () => {
      const wrapper = mount(BaseButton, {
        props: { variant: 'secondary' },
      })

      expect(wrapper.classes()).toContain('btn-secondary')
    })

    it('renders ghost variant correctly', () => {
      const wrapper = mount(BaseButton, {
        props: { variant: 'ghost' },
      })

      expect(wrapper.classes()).toContain('btn-ghost')
    })

    it('renders danger variant correctly', () => {
      const wrapper = mount(BaseButton, {
        props: { variant: 'danger' },
      })

      expect(wrapper.classes()).toContain('btn-danger')
    })
  })

  describe('Sizes', () => {
    it('renders small size correctly', () => {
      const wrapper = mount(BaseButton, {
        props: { size: 'sm' },
      })

      expect(wrapper.classes()).toContain('btn-sm')
    })

    it('renders medium size correctly', () => {
      const wrapper = mount(BaseButton, {
        props: { size: 'md' },
      })

      expect(wrapper.classes()).toContain('btn-md')
    })

    it('renders large size correctly', () => {
      const wrapper = mount(BaseButton, {
        props: { size: 'lg' },
      })

      expect(wrapper.classes()).toContain('btn-lg')
    })
  })

  describe('States', () => {
    it('handles disabled state', () => {
      const wrapper = mount(BaseButton, {
        props: { disabled: true },
      })

      expect(wrapper.attributes('disabled')).toBeDefined()
      expect(wrapper.attributes('aria-disabled')).toBe('true')
    })

    it('handles loading state', () => {
      const wrapper = mount(BaseButton, {
        props: { loading: true },
      })

      expect(wrapper.attributes('disabled')).toBeDefined()
      expect(wrapper.attributes('aria-busy')).toBe('true')
      expect(wrapper.text()).toContain('⏳')
    })

    it('does not emit click when disabled', async () => {
      const wrapper = mount(BaseButton, {
        props: { disabled: true },
      })

      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeUndefined()
    })

    it('does not emit click when loading', async () => {
      const wrapper = mount(BaseButton, {
        props: { loading: true },
      })

      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeUndefined()
    })
  })

  describe('Interactions', () => {
    it('emits click event when clicked', async () => {
      const wrapper = mount(BaseButton)

      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('handles Enter key press', async () => {
      const wrapper = mount(BaseButton)

      await wrapper.trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('handles Space key press', async () => {
      const wrapper = mount(BaseButton)

      await wrapper.trigger('keydown', { key: ' ' })
      expect(wrapper.emitted('click')).toHaveLength(1)
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      const wrapper = mount(BaseButton, {
        props: {
          ariaLabel: 'Submit form',
          disabled: true,
        },
      })

      expect(wrapper.attributes('aria-label')).toBe('Submit form')
      expect(wrapper.attributes('aria-disabled')).toBe('true')
    })

    it('sets type attribute correctly', () => {
      const wrapper = mount(BaseButton, {
        props: { type: 'submit' },
      })

      expect(wrapper.attributes('type')).toBe('submit')
    })
  })
})
