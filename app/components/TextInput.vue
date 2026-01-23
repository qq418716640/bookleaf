<script setup lang="ts">
import type { PresetConfig } from '~/types'

interface Props {
  quoteText: string
  authorText: string
  quotePlaceholder?: string
  authorPlaceholder?: string
  presets?: PresetConfig[]
  currentPresetId?: string
}

interface Emits {
  (e: 'update:quoteText', value: string): void
  (e: 'update:authorText', value: string): void
  (e: 'selectPreset', preset: PresetConfig): void
}

const props = withDefaults(defineProps<Props>(), {
  quotePlaceholder: 'Enter your quote here...',
  authorPlaceholder: 'Author name',
  presets: () => [],
  currentPresetId: '',
})

const emit = defineEmits<Emits>()

const handleQuoteInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:quoteText', target.value)
}

const handleAuthorInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:authorText', target.value)
}

const handleSelectPreset = (preset: PresetConfig) => {
  emit('selectPreset', preset)
}
</script>

<template>
  <div class="flex flex-col gap-16">
    <!-- Quote Input -->
    <div class="flex flex-col gap-12">
      <label
        for="quote-input"
        class="text-14 font-700 color-#484c44"
      >
        Quote
      </label>
      <textarea
        id="quote-input"
        :value="quoteText"
        :placeholder="quotePlaceholder"
        rows="4"
        class="input-base w-full resize-none"
        aria-describedby="quote-hint"
        @input="handleQuoteInput"
      />
      <p
        id="quote-hint"
        class="text-xs text-gray-500"
      >
        Enter the text you want to display on your poster
      </p>
    </div>

    <!-- Author Input -->
    <div class="flex flex-col gap-12">
      <label
        for="author-input"
        class="text-14 font-700 color-#484c44"
      >
        Author
      </label>
      <input
        id="author-input"
        type="text"
        :value="authorText"
        :placeholder="authorPlaceholder"
        class="input-base w-full h-40"
        aria-describedby="author-hint"
        @input="handleAuthorInput"
      />
      <p
        id="author-hint"
        class="text-xs text-gray-500"
      >
        Optional: Add the author's name
      </p>
    </div>

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
              :src="`/images/preview/${preset.id}-1350.jpg`" 
              :alt="`${preset.name} style preview`"
              class="w-full h-full object-cover"
            />
          </div>
          <!-- Style Name -->
          <span class="text-12 font-600 text-center">{{ preset.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
