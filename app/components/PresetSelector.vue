<script setup lang="ts">
import type { PresetConfig } from '~/types'
import useAnalytics from '~/composables/useAnalytics'

interface Props {
  presets: PresetConfig[]
  selectedId: string | null
}

interface Emits {
  (e: 'select', preset: PresetConfig): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const analytics = useAnalytics()

const isSelected = (preset: PresetConfig) => preset.id === props.selectedId

const handleSelect = (preset: PresetConfig) => {
  emit('select', preset)
  analytics.trackPresetSelected(preset.id)
}

const handleKeydown = (event: KeyboardEvent, preset: PresetConfig) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleSelect(preset)
  }
}

const getStyleDescription = (id: string) => {
  const descriptions: Record<string, string> = {
    editorial: 'Calm margins, like a magazine page',
    classic: 'Timeless serif, warm and familiar',
    modern: 'Clean rhythm, contemporary balance',
  }
  return descriptions[id] || 'Beautiful Design'
}
</script>

<template>
  <div
    role="radiogroup"
    aria-label="Select wedding invitation style"
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-24"
  >
    <button
      v-for="preset in presets"
      :key="preset.id"
      type="button"
      role="radio"
      :aria-checked="isSelected(preset)"
      :aria-label="`${preset.name} style`"
      class="preset-card group relative overflow-hidden rounded-3xl transition-all-300 p-0 b-none shadow-md shadow-#000/10"
      :class="[
        isSelected(preset)
          ? 'b-primary-400 b-1 b-solid'
          : '',
      ]"
      @click="handleSelect(preset)"
      @keydown="handleKeydown($event, preset)"
    >
      <!-- Thumbnail -->
      <div class="aspect-square overflow-hidden bg-gradient-to-br from-primary-50 to-gold-50">
        <NuxtImg
          :src="preset.thumbnailUrl"
          :alt="`${preset.name} wedding style preview`"
          class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          width="300"
          height="300"
          format="webp"
          quality="85"
        />
      </div>

      <!-- Preset name with gradient overlay -->
      <div class="relative bg-gradient-to-t from-white via-white/95 to-white/80 backdrop-blur-sm py-4">
        <h3
          class="text-base font-bold font-serif text-center transition-colors duration-300 my-0"
          :class="isSelected(preset) ? 'text-primary-600' : 'text-neutral-800 group-hover:text-primary-600'"
        >
          {{ preset.name }}
        </h3>
        <p class="text-xs text-center text-neutral-500 my-0 mt-16">
          {{ getStyleDescription(preset.id) }}
        </p>
      </div>

      <!-- Selected indicator with heart icon -->
      <div
        v-if="isSelected(preset)"
        class="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg animate-scale-in"
        aria-hidden="true"
      >
        <svg
          class="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
        </svg>
      </div>

      <!-- Hover overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      />
    </button>
  </div>
</template>

<style scoped>
.preset-card {
  cursor: pointer;
}

.preset-card:focus-visible {
  outline: none;
}

@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}
</style>
