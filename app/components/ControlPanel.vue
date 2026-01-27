<script setup lang="ts">
import type { TextAlignment, AspectRatio, PresetConfig } from '~/types'
import useAnalytics from '~/composables/useAnalytics'

// Get base URL for static assets
const config = useRuntimeConfig()
const baseUrl = config.app.baseURL || '/'

interface Props {
  filterIntensity: number
  quoteAlignment: TextAlignment
  authorAlignment: TextAlignment
  aspectRatio: AspectRatio
  presets: PresetConfig[]
  currentPresetId?: string
}

interface Emits {
  (e: 'update:filterIntensity', value: number): void
  (e: 'update:quoteAlignment', value: TextAlignment): void
  (e: 'update:authorAlignment', value: TextAlignment): void
  (e: 'update:aspectRatio', value: AspectRatio): void
  (e: 'selectPreset', preset: PresetConfig): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const analytics = useAnalytics()

const alignmentOptions: { value: TextAlignment; label: string }[] = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
]

const aspectRatioOptions: { value: AspectRatio; label: string }[] = [
  { value: '1:1', label: '1:1' },
  { value: '4:5', label: '4:5' },
]

const handleIntensityChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = Number(target.value)
  emit('update:filterIntensity', value)
  analytics.trackStyleStrengthChanged(value)
}

const handleQuoteAlignmentChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:quoteAlignment', target.value as TextAlignment)
}

const handleAuthorAlignmentChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:authorAlignment', target.value as TextAlignment)
}

const handleAspectRatioChange = (value: AspectRatio) => {
  emit('update:aspectRatio', value)
  analytics.trackRatioSelected(value)
}

const handleSelectPreset = (preset: PresetConfig) => {
  emit('selectPreset', preset)
  analytics.trackPresetSelected(preset.id)
}
</script>

<template>
  <div class="flex flex-col gap-16">
    <!-- Style Switcher -->
    <div class="flex flex-col gap-12">
      <label
        class="text-14 font-700 color-#484c44"
      >
        Style
      </label>
      <div class="grid grid-cols-3 gap-12">
        <button
          v-for="preset in presets"
          :key="preset.id"
          type="button"
          class="flex flex-col items-center gap-8 p-8 rounded-8 transition-all-300 cursor-pointer"
          :class="[
            currentPresetId === preset.id
              ? 'bg-#928B86 color-#fff'
              : 'bg-white border border-gray-200 hover:bg-#928B86 hover:color-#fff'
          ]"
          @click="handleSelectPreset(preset)"
        >
          <!-- Preview Image -->
          <div class="w-full aspect-[4/3] bg-gray-100 rounded-4 overflow-hidden">
            <img
              :src="`${baseUrl}${preset.thumbnailUrl}`"
              :alt="`${preset.name} style preview`"
              class="w-full h-full object-cover"
            />
          </div>
          <!-- Style Name -->
          <span class="text-12 font-600 text-center">{{ preset.name }}</span>
        </button>
      </div>
    </div>

    <!-- Style Intensity Slider -->
    <div class="flex flex-col gap-12">
      <div class="flex items-center justify-between">
        <label
          for="filter-intensity"
          class="text-14 font-700 color-#484c44"
        >
          Style Intensity
        </label>
        <span class="text-sm text-gray-500">{{ filterIntensity }}%</span>
      </div>
      <input
        id="filter-intensity"
        type="range"
        :value="filterIntensity"
        min="0"
        max="100"
        step="1"
        class="slider-base w-full"
        aria-describedby="intensity-hint"
        @input="handleIntensityChange"
      />
      <p
        id="intensity-hint"
        class="text-xs text-gray-500"
      >
        Adjust the filter overlay intensity
      </p>
    </div>

    <!-- Quote Alignment -->
    <div class="flex flex-col gap-12">
      <label
        for="quote-alignment"
        class="text-14 font-700 color-#484c44"
      >
        Quote Alignment
      </label>
      <select
        id="quote-alignment"
        :value="quoteAlignment"
        class="w-full h-40 px-12 py-4 border border-[#484c44] rounded-[10px] outline outline-1 outline-color-[#484c44] focus:outline-2 focus:outline-color-[#484c44] focus:ring-0 transition-all disabled:bg-neutral-100 disabled:cursor-not-allowed"
        @change="handleQuoteAlignmentChange"
      >
        <option
          v-for="option in alignmentOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <!-- Author Alignment -->
    <div class="flex flex-col gap-12">
      <label
        for="author-alignment"
        class="text-14 font-700 color-#484c44"
      >
        Author Alignment
      </label>
      <select
        id="author-alignment"
        :value="authorAlignment"
        class="w-full h-40 px-12 py-4 border border-[#484c44] rounded-[10px] outline outline-1 outline-color-[#484c44] focus:outline-2 focus:outline-color-[#484c44] focus:ring-0 transition-all disabled:bg-neutral-100 disabled:cursor-not-allowed"
        @change="handleAuthorAlignmentChange"
      >
        <option
          v-for="option in alignmentOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <!-- Aspect Ratio -->
    <div class="flex flex-col gap-12">
      <label
        for="author-alignment"
        class="text-14 font-700 color-#484c44"
      >
        Aspect Ratio
      </label>
      <div class="flex gap-20">
        <label
          v-for="option in aspectRatioOptions"
          :key="option.value"
          class="flex items-center gap-8 text-14 cursor-pointer"
        >
          <input
            type="radio"
            name="aspect-ratio"
            :value="option.value"
            :checked="aspectRatio === option.value"
            class="h-20 w-20 text-[#484c44] focus:ring-[#484c44] border-gray-300 aspect-ratio-radio"
            @change="handleAspectRatioChange(option.value)"
          />
          <span class="text-sm text-gray-700">{{ option.label }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<style>
/* Custom select dropdown with proper spacing */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23484c44' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
  padding-right: 36px !important;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

select::-ms-expand {
  display: none;
}

.slider-base {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  border-radius: 4px;
  background: #e5e7eb;
  outline: none;
}

.slider-base::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #484c44;
  cursor: pointer;
  transition: background 0.15s ease-in-out;
}

.slider-base::-webkit-slider-thumb:hover {
  background: #3a3d36;
}

.slider-base::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #484c44;
  cursor: pointer;
  border: none;
}

.slider-base:focus {
  outline: none;
}

.slider-base:focus-visible {
  box-shadow: 0 0 0 2px #484c44;
}
input[type="radio"] {
  -webkit-appearance: none; /* 移除默认样式 */
  -moz-appearance: none; /* 移除默认样式 */
  appearance: none; /* 移除默认样式 */
  width: 20px; /* 尺寸 */
  height: 20px; /* 尺寸 */
  border: 1px solid #484c44; /* 默认边框颜色 */
  border-radius: 50%; /* 圆形 */
  outline: none; /* 移除轮廓 */
  padding: 3px;
}
input[type="radio"]:after {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #fff;
}
input[type="radio"]:checked{
  border-color: #484c44; /* 默认边框颜色 */
}
input[type="radio"]:checked:after {
  background-color: #484c44; /* 选中颜色 */
}
</style>
