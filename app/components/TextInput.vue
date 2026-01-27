<script setup lang="ts">
import type { PresetConfig } from '~/types'

// Get base URL for static assets
const config = useRuntimeConfig()
const baseUrl = config.app.baseURL || '/'

interface Props {
  quoteText: string
  authorText: string
  quotePlaceholder?: string
  authorPlaceholder?: string
}

interface Emits {
  (e: 'update:quoteText', value: string): void
  (e: 'update:authorText', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  quotePlaceholder: 'Enter your quote here...',
  authorPlaceholder: 'Author name',
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
  </div>
</template>
