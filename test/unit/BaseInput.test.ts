import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '~/components/base/BaseInput.vue'

describe('BaseInput', () => {
  describe('Text Input', () => {
    it('renders text input correctly', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: 'test value',
          type: 'text',
        },
      })

      const input = wrapper.find('input')
      expect(input.exists()).toBe(true)
      expect(input.element.value).toBe('test value')
    })

    it('renders with label', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          label: 'Username',
        },
      })

      const label = wrapper.find('label')
      expect(label.exists()).toBe(true)
      expect(label.text()).toBe('Username')
    })

    it('renders with placeholder', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          placeholder: 'Enter your name',
        },
      })

      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toBe('Enter your name')
    })
  })

  describe('Textarea', () => {
    it('renders textarea correctly', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: 'multiline text',
          type: 'textarea',
        },
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.exists()).toBe(true)
      expect(textarea.element.value).toBe('multiline text')
    })

    it('sets rows attribute', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          type: 'textarea',
          rows: 6,
        },
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.attributes('rows')).toBe('6')
    })
  })

  describe('Input Events', () => {
    it('emits update:modelValue on input', async () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
        },
      })

      const input = wrapper.find('input')
      await input.setValue('new value')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
    })

    it('emits update:modelValue on textarea input', async () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          type: 'textarea',
        },
      })

      const textarea = wrapper.find('textarea')
      await textarea.setValue('new multiline value')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new multiline value'])
    })
  })

  describe('Error State', () => {
    it('displays error message', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          error: 'This field is required',
        },
      })

      const errorMsg = wrapper.find('[role="alert"]')
      expect(errorMsg.exists()).toBe(true)
      expect(errorMsg.text()).toBe('This field is required')
    })

    it('applies error styling', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          error: 'Invalid input',
        },
      })

      const input = wrapper.find('input')
      expect(input.classes()).toContain('input-error')
    })

    it('sets aria-invalid when error exists', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          error: 'Error message',
        },
      })

      const input = wrapper.find('input')
      expect(input.attributes('aria-invalid')).toBe('true')
    })
  })

  describe('Disabled State', () => {
    it('disables input when disabled prop is true', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          disabled: true,
        },
      })

      const input = wrapper.find('input')
      expect(input.attributes('disabled')).toBeDefined()
    })
  })

  describe('Accessibility', () => {
    it('associates label with input using id', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          label: 'Email',
          id: 'email-input',
        },
      })

      const label = wrapper.find('label')
      const input = wrapper.find('input')

      expect(label.attributes('for')).toBe('email-input')
      expect(input.attributes('id')).toBe('email-input')
    })

    it('sets aria-describedby for error', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          error: 'Error message',
          id: 'test-input',
        },
      })

      const input = wrapper.find('input')
      expect(input.attributes('aria-describedby')).toContain('test-input-error')
    })
  })
})
