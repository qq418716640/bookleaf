<script setup lang="ts">
export interface BaseInputProps {
  modelValue: string
  type?: 'text' | 'textarea'
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  rows?: number
  maxlength?: number
  id?: string
  ariaDescribedby?: string
}

const props = withDefaults(defineProps<BaseInputProps>(), {
  type: 'text',
  disabled: false,
  rows: 4,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)
const errorId = computed(() => `${inputId.value}-error`)
const describedBy = computed(() => {
  const ids = []
  if (props.error) ids.push(errorId.value)
  if (props.ariaDescribedby) ids.push(props.ariaDescribedby)
  return ids.length > 0 ? ids.join(' ') : undefined
})

const inputClasses = computed(() => {
  const classes = ['input-base']
  if (props.error) {
    classes.push('input-error')
  }
  return classes.join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-neutral-700 mb-6">
      {{ label }}
    </label>

    <textarea
      v-if="type === 'textarea'"
      :id="inputId"
      :value="modelValue"
      :class="inputClasses"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :maxlength="maxlength"
      :aria-describedby="describedBy"
      :aria-invalid="!!error"
      @input="handleInput"
    />

    <input
      v-else
      :id="inputId"
      :value="modelValue"
      :type="type"
      :class="inputClasses"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      :aria-describedby="describedBy"
      :aria-invalid="!!error"
      @input="handleInput"
    />

    <p v-if="error" :id="errorId" class="mt-6 text-sm text-error-600" role="alert">
      {{ error }}
    </p>
  </div>
</template>
