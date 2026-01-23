<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  disabled?: boolean
}

interface Emits {
  (e: 'export'): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<Emits>()

const isExporting = ref(false)
const exportStatus = ref<'idle' | 'success' | 'error'>('idle')

const handleExport = async () => {
  if (props.disabled || isExporting.value) return

  isExporting.value = true
  exportStatus.value = 'idle'

  try {
    emit('export')
    // Status will be updated by parent component
  } catch {
    exportStatus.value = 'error'
  } finally {
    isExporting.value = false
  }
}

// Method to update status from parent
const setStatus = (status: 'idle' | 'success' | 'error') => {
  exportStatus.value = status
  if (status !== 'idle') {
    setTimeout(() => {
      exportStatus.value = 'idle'
    }, 3000)
  }
}

const setExporting = (value: boolean) => {
  isExporting.value = value
}

defineExpose({
  setStatus,
  setExporting,
})
</script>

<template>
  <div class="export-button-container">
    <button
      type="button"
      class="btn-secondary border-none! cursor-pointer w-full flex items-center justify-center gap-12 py-16 px-32 text-base font-semibold shadow-soft-gold hover:shadow-xl transition-all duration-300 rounded-[10px]"
      :disabled="disabled || isExporting"
      :aria-disabled="disabled || isExporting"
      :aria-busy="isExporting"
      @click="handleExport"
    >
      <!-- Loading spinner with heart -->
      <div
        v-if="isExporting"
        class="relative"
      >
        <svg
          class="animate-spin h-24 w-24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="3"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <svg class="absolute inset-0 w-3 h-3 m-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
        </svg>
      </div>

      <!-- Download icon -->
      <svg
        v-else
        class="h-24 w-24"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>

      <span>
        {{ isExporting ? 'Creating Your Design...' : 'Download Invitation' }}
      </span>
    </button>

    <!-- Status message -->
    <Transition name="fade-slide">
      <div
        v-if="exportStatus === 'success'"
        class="mt-16 p-16 bg-gradient-to-r from-primary-50 to-gold-50 rounded-2xl text-center shadow-soft"
        role="status"
        aria-live="polite"
      >
        <div class="flex items-center justify-center gap-2 text-primary-700 font-medium">
          <svg class="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span>Your invitation is ready!</span>
        </div>
      </div>
      <div
        v-else-if="exportStatus === 'error'"
        class="mt-16 p-16 bg-error-50 rounded-2xl text-center shadow-soft"
        role="alert"
      >
        <div class="flex items-center justify-center gap-2 text-error-700 font-medium">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <span>Oops! Please try again.</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
