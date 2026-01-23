<script setup lang="ts">
export interface BaseSliderProps {
  modelValue: number
  label?: string
  min?: number
  max?: number
  step?: number
  showValue?: boolean
  disabled?: boolean
  id?: string
  unit?: string
}

const props = withDefaults(defineProps<BaseSliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
  showValue: true,
  disabled: false,
  unit: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const sliderId = computed(() => props.id || `slider-${Math.random().toString(36).substr(2, 9)}`)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', Number(target.value))
}

const displayValue = computed(() => {
  return props.unit ? `${props.modelValue}${props.unit}` : props.modelValue
})
</script>

<template>
  <div class="w-full">
    <div v-if="label || showValue" class="flex-between mb-8">
      <label v-if="label" :for="sliderId" class="text-sm font-medium text-neutral-700">
        {{ label }}
      </label>
      <span v-if="showValue" class="text-sm font-semibold text-primary-600" aria-live="polite">
        {{ displayValue }}
      </span>
    </div>

    <input
      :id="sliderId"
      type="range"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :aria-label="label"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="modelValue"
      :aria-disabled="disabled"
      class="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      @input="handleInput"
    />

    <div class="flex-between mt-4 text-xs text-neutral-500">
      <span>{{ min }}{{ unit }}</span>
      <span>{{ max }}{{ unit }}</span>
    </div>
  </div>
</template>

<style scoped>
/* Webkit browsers (Chrome, Safari, Edge) */
input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: #0284c7;
  cursor: pointer;
  transition: all 0.2s;
}

input[type='range']::-webkit-slider-thumb:hover {
  background: #0369a1;
  transform: scale(1.1);
}

input[type='range']:disabled::-webkit-slider-thumb {
  background: #a3a3a3;
  cursor: not-allowed;
}

/* Firefox */
input[type='range']::-moz-range-thumb {
  width: 1.25rem;
  height: 1.25rem;
  border: none;
  border-radius: 50%;
  background: #0284c7;
  cursor: pointer;
  transition: all 0.2s;
}

input[type='range']::-moz-range-thumb:hover {
  background: #0369a1;
  transform: scale(1.1);
}

input[type='range']:disabled::-moz-range-thumb {
  background: #a3a3a3;
  cursor: not-allowed;
}
</style>
