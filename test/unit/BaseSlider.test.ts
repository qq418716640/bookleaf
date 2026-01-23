import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseSlider from '~/components/base/BaseSlider.vue'

describe('BaseSlider', () => {
  describe('Rendering', () => {
    it('renders slider with default props', () => {
      const wrapper = mount(BaseSlider, {
        props: {
          modelValue: 50,
        },
      })

      const slider = wrapper.find('input[type="range"]')
      expect(slider.exists()).toBe(true)
      expect(slider.element.value).toBe('50')
    })

    it('renders with label', () => {
      const wrapper = mount(BaseSlider, {
        props: {
          modelValue: 50,
          label: 'Volume',
        },
      })

      const label = wrapper.find('label')
      expect(label.exists()).toBe(true)
      expect(label.text()).toBe('Volume')
    })

    it('displays current value when showValue is true', () => {
      const wrapper = mount(BaseSlider, {
        props: {
          modelValue: 75,
          showValue: true,
        },
      })

      expect(wrapper.text()).toContain('75')
    })

    it('hides value when showValue is false', () => {
      const wrapper = mount(BaseSlider, {
        props: {
          modelValue: 75,
          showValue: false,
        },
      })

      const valueDisplay = wrapper.find('[aria-live="polite"]')
      expect(valueDisplay.exists()).toBe(false)
    })

    it('displays value with unit', () => {
      const wrapper = mount(BaseSlider, {
        props: {
          modelValue: 50,
          unit: '%',
          showValue: true,
        },
      })

      expect(wrapper.text()).toContain('50%')
    })
  })

  describe('Range Configuration', () => {
    it('sets min and max attributes', () => {
      const wrapper = mount(BaseSlider, {
        props: {
          modelValue: 50,
          min: 0,
          max: 100,
        },
      })

      const slider = wrapper.find('input[type="range"]')
      expect(slider.attributes('min')).toBe('0')
      expect(slider.attributes('max')).toBe('100')
    })

    it('sets step attribute', () => {
      const wrapper = mount(BaseSlider, {
        props: {
          modelValue: 50,
          step: 5,
        },
      })

      const slider = wrapper.find('input[type="range"]')
      expect(slider.attributes('step')).toBe('5')
    })

    it('displays min and max labels', () => {
      const wrapper = mount(BaseSlider, {
        props: {
          modelValue: 50,
          min: 10,
          max: 90,
        },
      })

      expect(wrapper.text()).toContain('10')
      expect(wrapper.text()).toContain('90')
    })
  })

  describe('Value Changes', () => {
    it('emits update:modelValue on input', async () => {
      const wrapper = mount(BaseSlider, {
        props: {
          modelValue: 50,
        },
      })

      const slider = wrapper.find('input[type="range"]')
      await slider.setValue(75)

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([75])
    })

    it('emits numeric value', async () => {
      const wrapper = mount(BaseSlider, {
        props: {
          modelValue: 0,
        },
      })

      const slider = wrapper.find('input[type="range"]')
      await slider.setValue('42')

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeTruthy()
      expect(typeof emitted?.[0][0]).toBe('number')
      expect(emitted?.[0][0]).toBe(42)
    })
  })

  describe('Disabled State', () => {
    it('disables slider when disabled prop is true', () => {
      const wrapper = mount(BaseSlider, {
        props: {
          modelValue: 50,
          disabled: true,
        },
      })

      const slider = wrapper.find('input[type="range"]')
      expect(slider.attributes('disabled')).toBeDefined()
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      const wrapper = mount(BaseSlider, {
        props: {
          modelValue: 50,
          min: 0,
          max: 100,
          label: 'Intensity',
        },
      })

      const slider = wrapper.find('input[type="range"]')
      expect(slider.attributes('aria-label')).toBe('Intensity')
      expect(slider.attributes('aria-valuemin')).toBe('0')
      expect(slider.attributes('aria-valuemax')).toBe('100')
      expect(slider.attributes('aria-valuenow')).toBe('50')
    })

    it('sets aria-disabled when disabled', () => {
      const wrapper = mount(BaseSlider, {
        props: {
          modelValue: 50,
          disabled: true,
        },
      })

      const slider = wrapper.find('input[type="range"]')
      expect(slider.attributes('aria-disabled')).toBe('true')
    })

    it('associates label with slider using id', () => {
      const wrapper = mount(BaseSlider, {
        props: {
          modelValue: 50,
          label: 'Volume',
          id: 'volume-slider',
        },
      })

      const label = wrapper.find('label')
      const slider = wrapper.find('input[type="range"]')

      expect(label.attributes('for')).toBe('volume-slider')
      expect(slider.attributes('id')).toBe('volume-slider')
    })
  })
})
