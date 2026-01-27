<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import type { PresetConfig, TextAlignment, AspectRatio } from '~/types'
import { PosterRenderer, type RenderConfig } from '~/utils/PosterRenderer'
import { CANVAS_DIMENSIONS } from '~/utils/CanvasRenderer'

interface Props {
  preset: PresetConfig | null
  quoteText: string
  authorText: string
  quoteAlignment: TextAlignment
  authorAlignment: TextAlignment
  filterIntensity: number
  aspectRatio: AspectRatio
  backgroundImage: HTMLImageElement | null
  filterImage: HTMLImageElement | null
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const renderer = ref<PosterRenderer | null>(null)

// Calculate preview dimensions (max 600px width, maintain aspect ratio)
const previewDimensions = computed(() => {
  const dimensions = CANVAS_DIMENSIONS[props.aspectRatio]
  const maxWidth = 600
  const scale = Math.min(1, maxWidth / dimensions.width)
  return {
    width: dimensions.width * scale,
    height: dimensions.height * scale,
  }
})

// Initialize renderer
onMounted(() => {
  if (canvasRef.value) {
    renderer.value = new PosterRenderer(canvasRef.value, props.aspectRatio)
    renderPoster()
  }
})

// Watch for aspect ratio changes separately to handle canvas resize
watch(
  () => props.aspectRatio,
  async (newRatio, oldRatio) => {
    console.log('[CanvasPreview] Aspect ratio changed:', oldRatio, '->', newRatio)
    console.log('[CanvasPreview] Images available:', {
      background: !!props.backgroundImage,
      filter: !!props.filterImage,
      preset: !!props.preset
    })
    
    if (renderer.value && canvasRef.value) {
      // Update canvas dimensions directly
      const dimensions = CANVAS_DIMENSIONS[newRatio]
      canvasRef.value.width = dimensions.width
      canvasRef.value.height = dimensions.height
      
      console.log('[CanvasPreview] Canvas resized to:', dimensions)
      
      // Update renderer's aspect ratio
      renderer.value.setAspectRatio(newRatio)
      
      // Wait for next tick to ensure DOM is updated
      await nextTick()
      
      // Re-render with new dimensions
      console.log('[CanvasPreview] Calling renderPoster after resize')
      renderPoster()
    }
  }
)

// Watch for other changes and re-render
watch(
  () => [
    props.preset,
    props.quoteText,
    props.authorText,
    props.quoteAlignment,
    props.authorAlignment,
    props.filterIntensity,
    props.backgroundImage,
    props.filterImage,
  ],
  () => {
    renderPoster()
  },
  { deep: true }
)

// Render poster
const renderPoster = () => {
  console.log('[CanvasPreview] renderPoster called')
  console.log('[CanvasPreview] Render conditions:', {
    hasRenderer: !!renderer.value,
    hasPreset: !!props.preset,
    hasBackground: !!props.backgroundImage,
    hasFilter: !!props.filterImage
  })
  
  if (!renderer.value || !props.preset || !props.backgroundImage || !props.filterImage) {
    console.warn('[CanvasPreview] Cannot render - missing required data')
    return
  }

  console.log('[CanvasPreview] Rendering with config:', {
    aspectRatio: props.aspectRatio,
    quoteText: props.quoteText.substring(0, 20) + '...',
    filterIntensity: props.filterIntensity
  })

  const config: RenderConfig = {
    preset: props.preset,
    quoteText: props.quoteText,
    authorText: props.authorText,
    quoteAlignment: props.quoteAlignment,
    authorAlignment: props.authorAlignment,
    filterIntensity: props.filterIntensity,
    aspectRatio: props.aspectRatio,
  }

  renderer.value.render(config, props.backgroundImage, props.filterImage)
  console.log('[CanvasPreview] Render complete')
}

// Expose renderer for parent component
defineExpose({
  getRenderer: () => renderer.value,
  getCanvas: () => canvasRef.value,
})
</script>

<template>
  <div class="canvas-preview-container relative">
    <!-- Loading overlay -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded-lg z-10"
      role="status"
      aria-label="Loading preview"
    >
      <div class="flex flex-col items-center gap-8">
        <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        <span class="text-sm text-gray-600">Loading...</span>
      </div>
    </div>

    <!-- Canvas wrapper with responsive scaling -->
    <div
      class="canvas-wrapper mx-auto overflow-hidden rounded-lg shadow-lg bg-gray-100"
      :style="{
        width: `${previewDimensions.width}px`,
        maxWidth: '100%',
        aspectRatio: aspectRatio === '1:1' ? '1/1' : '4/5',
      }"
    >
      <canvas
        ref="canvasRef"
        :width="CANVAS_DIMENSIONS[aspectRatio].width"
        :height="CANVAS_DIMENSIONS[aspectRatio].height"
        class="w-full h-full"
        aria-label="Poster preview canvas"
        role="img"
      />
    </div>

    <!-- Empty state -->
    <div
      v-if="!preset && !isLoading"
      class="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg"
    >
      <p class="text-gray-500 text-center px-16">
        Select a preset to start creating your poster
      </p>
    </div>
  </div>
</template>

<style scoped>
.canvas-preview-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.canvas-wrapper {
  transition: aspect-ratio 0.3s ease;
}
</style>
