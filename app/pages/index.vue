<script setup lang="ts">
import { onMounted, ref, onMounted as vueOnMounted } from 'vue'
import { usePosterApp } from '~/composables/usePosterApp'
import useAnalytics, { getDeviceType } from '~/composables/useAnalytics'

// Get base URL for static assets
const config = useRuntimeConfig()
const baseUrl = config.app.baseURL || '/'

// SEO Meta Tags - Bookleaf
useSeoMeta({
  title: 'Bookleaf — For the lines you'll remember',
  description:
    'A free online tool to turn book excerpts and words into clean, editorial-style visuals. No signup required. Export JPG instantly. Ideal for quotes, poems, and memorable lines.',
  keywords:
    'book quotes, excerpts, poster generator, free design tool, quote maker, JPG export',
  ogTitle: 'Bookleaf — For the lines you'll remember',
  ogDescription:
    'A free online tool to turn book excerpts and words into clean, editorial-style visuals. No signup required. Export JPG instantly. Ideal for quotes, poems, and memorable lines.',
  ogImage: '/og-image.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Bookleaf — For the lines you'll remember',
  twitterDescription:
    'A free online tool to turn book excerpts and words into clean, editorial-style visuals. No signup required. Export JPG instantly. Ideal for quotes, poems, and memorable lines.',
  twitterImage: '/og-image.png',
})

// Structured Data (JSON-LD) - Bookleaf
useSchemaOrg([
  {
    '@type': 'WebApplication',
    name: 'Bookleaf',
    description:
      'A quiet collection of words worth remembering — excerpts, mottos, and lines from books you love.',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Free to use',
      'No signup required',
      'Export as JPG',
      'Multiple design presets',
      'Customizable typography',
    ],
  },
])

// Initialize analytics
const analytics = useAnalytics()

// Initialize poster app
const {
  presets,
  currentPreset,
  quoteText,
  authorText,
  filterIntensity,
  quoteAlignment,
  authorAlignment,
  aspectRatio,
  backgroundImage,
  filterImage,
  isInitializing,
  isExporting,
  isReady,
  canExport,
  error,
  initialize,
  selectPreset,
  setQuoteText,
  setAuthorText,
  setFilterIntensity,
  setQuoteAlignment,
  setAuthorAlignment,
  setAspectRatio,
  exportPoster,
} = usePosterApp()

// Random Excerpt Demo
const excerpts = ref([])
const currentExcerpt = ref(null)
const isLoadingExcerpts = ref(false)

// Load excerpts from JSON
const loadExcerpts = async () => {
  try {
    isLoadingExcerpts.value = true
    const response = await fetch(`${baseUrl}content/randomExcerpts.v1.json`)
    const data = await response.json()
    excerpts.value = data
    selectRandomExcerpt()
  } catch (error) {
    console.error('Failed to load excerpts:', error)
  } finally {
    isLoadingExcerpts.value = false
  }
}

// Select a random excerpt
const selectRandomExcerpt = () => {
  if (excerpts.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * excerpts.value.length)
    currentExcerpt.value = excerpts.value[randomIndex]
  }
}

// Keep current excerpt and scroll to app
const keepThisExcerpt = () => {
  console.log('keepThisExcerpt function called')
  if (currentExcerpt.value) {
    // Record excerpt_id (for analytics)
    console.log('Keeping excerpt:', currentExcerpt.value.id)

    // Set quote text
    setQuoteText(currentExcerpt.value.text)
    setAuthorText(`— ${currentExcerpt.value.author}`)

    // Switch to Editorial preset
    if (presets.value) {
      const editorialPreset = presets.value.find(p => p.id === 'Editorial')
      if (editorialPreset) {
        console.log('Switching to Editorial preset')
        selectPreset(editorialPreset.id)
      }
    } else {
      console.error('presets.value is undefined')
    }

    // Force scroll to try section immediately after UI updates
    console.log('Attempting to scroll to #try element')

    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      const tryElement = document.getElementById('try')
      console.log('Try element found:', !!tryElement)

      if (tryElement) {
        console.log('Try element position:', tryElement.getBoundingClientRect())
        console.log('Try element offsetTop:', tryElement.offsetTop)

        // Try a more direct approach with immediate scroll
        try {
          // First, scroll immediately to the element
          window.scrollTo({
            top: tryElement.offsetTop - 100, // Offset for header
            behavior: 'instant'
          })
          console.log('Immediate scroll executed')

          // Then, if needed, do a small smooth adjustment
          setTimeout(() => {
            tryElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
            console.log('Smooth adjustment executed')
          }, 100)
        } catch (error) {
          console.error('Scroll error:', error)
        }
      } else {
        console.error('Element with id "try" not found')
        // Log all elements with IDs to debug
        const allElements = document.querySelectorAll('[id]')
        console.log('All elements with IDs:', Array.from(allElements).map(el => el.id))
      }
    })
  } else {
    console.log('No current excerpt to keep')
  }
}

// Export button ref
const exportButtonRef = ref<{ setStatus: (status: 'idle' | 'success' | 'error') => void; setExporting: (value: boolean) => void } | null>(null)

// FAQ data
const faqItems = ref([
  { id: 1, question: 'Is Bookleaf free to use?', answer: 'Yes. Bookleaf is completely free to use, with no hidden limits or fees.' },
  { id: 2, question: 'Do I need to sign up?', answer: 'No. Bookleaf does not require any signup or login.' },
  { id: 3, question: 'What file format can I export?', answer: 'Bookleaf exports high‑resolution JPG files.' },
  { id: 4, question: 'What sizes are supported?', answer: '1:1 and 4:5 formats are supported.' },
  { id: 5, question: 'Is there a watermark?', answer: 'No. Exported images are clean and watermark‑free.' },
  { id: 6, question: 'Is my text saved or uploaded?', answer: 'No. Your words stay in your browser. Bookleaf does not store your content.' },
  { id: 7, question: 'What is Bookleaf best used for?', answer: 'Quotes, excerpts, mottos, reading notes, and lines you want to keep.' },
  { id: 8, question: 'Is Bookleaf an AI tool?', answer: 'No. Bookleaf focuses on layout and presentation. You bring the words.' }
])

// Step data for How it works section
const steps = [
  {
    id: 1,
    title: 'Choose a tone',
    description: 'Each preset reflects a different editorial mood.'
  },
  {
    id: 2,
    title: 'Enter the words',
    description: 'A quote, an excerpt, or a short passage.'
  },
  {
    id: 3,
    title: 'Keep the page',
    description: 'Save it as a simple image, ready to be shared.'
  }
]

// FAQ open state
const faqOpen = ref(0)

// Handle export
const handleExport = async () => {
  // Track export click
  analytics.trackClickExport(currentPreset.value?.id || 'unknown', aspectRatio.value)

  exportButtonRef.value?.setExporting(true)
  const success = await exportPoster()
  exportButtonRef.value?.setExporting(false)
  exportButtonRef.value?.setStatus(success ? 'success' : 'error')

  // Track export result
  if (success) {
    analytics.trackExportSuccess(1024) // Mock file size
  } else {
    analytics.trackExportFailed('unknown_error')
  }
}

// Initialize on mount
onMounted(() => {
  initialize()
  loadExcerpts()

  // Track page view
  analytics.trackPageView('home')

  // Setup scroll tracking
  analytics.setupScrollTracking('home')

  // Track app visible when ready
  if (isReady.value) {
    analytics.trackAppVisible(getDeviceType())
  }
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Skip to content link for accessibility -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-24 focus:py-12 focus:bg-primary-500 focus:text-white focus:rounded-full focus:shadow-lg"
    >
      Skip to main content
    </a>

    <!-- Decorative Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-gold-200/20 rounded-full blur-3xl" />
    </div>

    <!-- Header -->
    <header class="relative bg-white/80 backdrop-blur-md shadow-soft border-b border-primary-100/50">
      <div class="max-w-7xl mx-auto py-20 lt-md:py-12 lt-md:px-20">
        <div class="flex items-center justify-between">
          <div class="flex items-center shrink-0 gap-24">
            <img
              :src="`${baseUrl}images/logo/Bookleaf-black.svg`"
              alt="Bookleaf Logo"
              class="h-20 vertical-align-middle"
            />

            <div class="text-14 leading-20 color-#484c44 lt-md:hidden">
              For the lines you'll remember
            </div>
          </div>

          <!-- Right: Buttons -->
          <div class="flex items-center gap-20">
            <a
              href="#examples"
              class="btn-secondary py-6! px-12! text-14!"
              @click="analytics.trackClickExamples('default')"
            >
              Try It Free
            </a>
            <a href="#try" class="text-14 color-#484c44 hover:color-#849975! lt-md:hidden" @click="() => { analytics.trackClickExamples('default'); selectRandomExcerpt(); keepThisExcerpt(); }">Examples</a>
            <a href="#try" class="text-14 color-#484c44 hover:color-#849975! lt-md:hidden" @click="() => { selectRandomExcerpt(); keepThisExcerpt(); }">More Tools</a>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main id="main-content" class="relative container-base p-0!">
      <!-- Loading State -->
      <div
        v-if="isInitializing"
        class="fixed inset-0 bg-white z-50 flex items-center justify-center"
        role="status"
        aria-label="Loading application"
      >
        <div class="flex flex-col items-center gap-6">
          <div class="relative">
            <div class="animate-spin h-16 w-16 border-4 border-primary-200 border-t-primary-500 rounded-full" />
            <div class="absolute inset-0 flex-center">
              <svg class="w-6 h-6 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
          <p class="text-neutral-600 font-medium">Preparing your wedding design studio...</p>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-if="error"
        class="fixed inset-0 bg-white z-50 flex items-center justify-center"
        role="alert"
      >
        <div class="text-center card-glass max-w-md p-8">
          <div class="w-16 h-16 bg-error-100 rounded-full flex-center mx-auto mb-16">
            <svg class="w-8 h-8 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p class="text-error-600 mb-24 text-lg">{{ error }}</p>
          <button
            class="btn-primary"
            @click="initialize"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Main Application -->
      <section
        aria-labelledby="app-title"
      >
        <div class="flex flex-col">
          <!-- Hero Section with background image -->
          <div class="relative">
            <!-- Background image with opacity -->
            <div class="absolute inset-0 bg-no-repeat bg-cover opacity-70" :style="{'background-image': `url(${baseUrl}images/bg.jpg)`}"></div>
            <div class="relative z-10 max-w-7xl mx-auto flex items-center justify-between gap-160 lt-md:p-20">
            <div class="flex flex-col">
              <h1
                id="app-title"
                class="text-80 font-serif text-#484c44 lt-md:text-40"
                style="line-height: 120%;"
              >
                Bookleaf
              </h1>
              <h2 class="text-40 font-serif text-#484c44 lt-md:text-24 mt-0" style="line-height: 120%;">For the lines you'll remember.</h2>
              <p class="text-#7c7d7c text-16 mt-24 lt-md:text-14" style="line-height: 170%;">
                A quiet collection of words worth remembering — turn excerpts, mottos, and lines from books into clean, editorial-style visuals. Free to use. No signup required. Export as JPG.
              </p>
              <div class="flex gap-20 mt-20" lt-md="w-100% items-center gap-10 justify-center">
              <a
                href="#try"
                class="btn-secondary"
                lt-md="py-10! px-14! text-14!"
                @click="analytics.trackClickTryBookleaf('default')"
              >
                Try Bookleaf
              </a>
              <a
                href="#try"
                class="btn-secondary bg-#fff text-#484c44! hover:bg-#fff! hover:opacity-70"
                lt-md="py-10! px-14! text-14!"
                @click="() => { analytics.trackClickExamples('default'); selectRandomExcerpt(); keepThisExcerpt(); }"
              >
                Examples
              </a>
            </div>
            </div>
            <div class="relative flex lt-md:hidden">
              <img
                :src="`${baseUrl}images/book.jpg`"
                alt="Bookleaf Hero"
                class="w-full h-auto"
                loading="eager"
                width="400"
                height="500"
              />
              <img
                :src="`${baseUrl}images/preview/Editorial-1350.jpg`"
                alt="Bookleaf Preview"
                class="absolute -left-30% top-50% -translate-y-50% w-80%"
                loading="lazy"
                width="320"
                height="400"
              />
            </div>
          </div>
        </div>
        <div class="max-w-7xl mx-auto box-border flex flex-col gap-80" lt-md="px-20 gap-40">

          <!-- Random Excerpt Demo -->
          <section class="my-40 py-24 px-40 bg-#fffcf6 backdrop-blur-sm rounded-4 flex items-center justify-between" lt-md="flex-col gap-y-4" style="box-shadow: 0 4px 4px rgba(94, 85, 77, 0.16);">
            <div v-if="currentExcerpt" class="flex items-center gap-20" lt-md="flex-col gap-y-0">
              <p class="text-16 text-#4c4c48 font-600" style="font-family: 'Crimson Text', serif; line-height: 150%;">{{ currentExcerpt.text }}</p>
              <p class="text-16 text-#4c4c48 font-600 italic" style="font-family: 'Crimson Text', serif; line-height: 150%;">— {{ currentExcerpt.author }}</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-16 justify-center">
              <button
                @click="keepThisExcerpt"
                class="btn-primary border-none! cursor-pointer"
              >
                keep this line
              </button>
              <button
                @click="selectRandomExcerpt"
                class="btn-secondary border-none! cursor-pointer"
              >
                another line
              </button>
            </div>
          </section>

          <!-- Application Content Area -->
          <div class="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lt-md:gap-20" id="try">
            <!-- Control Panel (Left Side) -->
            <aside
              aria-label="Design controls"
              class="w-full max-w-[360px] mx-auto lg:mx-0 flex flex-col gap-24"
            >
              <!-- Text Input Card -->
              <div class="card-glass p-24! flex flex-col gap-24">
                <div class="flex items-center gap-12">
                  <div class="w-40 h-40 bg-secondary-500 rounded-full flex-center shadow-soft" lt-md="w-30 h-30">
                    <svg class="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 class="text-2xl font-bold font-serif text-primary-700">Your Message</h3>
                </div>
                <TextInput
                  :quote-text="quoteText"
                  :author-text="authorText"
                  @update:quote-text="setQuoteText"
                  @update:author-text="setAuthorText"
                />

                <div class="flex items-center gap-12">
                  <div class="w-40 h-40 bg-secondary-500 rounded-full flex-center shadow-soft" lt-md="w-30 h-30">
                    <svg class="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <h3 class="text-2xl font-bold font-serif text-primary-700">Customize</h3>
                </div>
                <ControlPanel
                  :filter-intensity="filterIntensity"
                  :quote-alignment="quoteAlignment"
                  :author-alignment="authorAlignment"
                  :aspect-ratio="aspectRatio"
                  :presets="presets"
                  :current-preset-id="currentPreset?.id"
                  @update:filter-intensity="setFilterIntensity"
                  @update:quote-alignment="setQuoteAlignment"
                  @update:author-alignment="setAuthorAlignment"
                  @update:aspect-ratio="setAspectRatio"
                  @select-preset="selectPreset"
                />
              </div>

              <!-- Export Button -->
              <ExportButton
                ref="exportButtonRef"
                :disabled="!canExport"
                @export="handleExport"
              />
            </aside>

            <!-- Canvas Preview (Right Side) -->
            <section
              aria-label="Design preview"
              class="w-full"
            >
              <div class="card-glass p-24!">
                <div class="flex items-center justify-between mb-24">
                  <div class="flex items-center gap-12">
                    <div class="w-40 h-40 bg-#849975 rounded-full flex-center shadow-soft" lt-md="w-30 h-30">
                      <svg class="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 class="text-2xl font-bold font-serif text-primary-700">Live Preview</h3>
                  </div>
                  <span class="text-sm text-neutral-500 bg-white/60 px-12 py-4 rounded-full lt-md:hidden">Real-time</span>
                </div>
                <div class="w-full max-w-[600px] mx-auto p-0! bg-gradient-to-br from-primary-50 to-gold-50 rounded-2xl">
                  <CanvasPreview
                    :preset="currentPreset"
                    :quote-text="quoteText"
                    :author-text="authorText"
                    :quote-alignment="quoteAlignment"
                    :author-alignment="authorAlignment"
                    :filter-intensity="filterIntensity"
                    :aspect-ratio="aspectRatio"
                    :background-image="backgroundImage"
                    :filter-image="filterImage"
                    :is-loading="isExporting"
                  />
                </div>
              </div>
            </section>
          </div>

          <!-- How it works -->
          <section class="" id="how-it-works">
            <div class="text-center">
              <h2 class="text-5xl font-bold font-serif text-primary-700 mb-8" lt-md="text-3xl">How it works</h2>
              <p class="text-neutral-600 mb-32">No design skills required. Just words.</p>
            </div>
            <div class="">
              <!-- Step bar container -->
              <div class="relative grid grid-cols-3 mb-32 gap-20" lt-md="grid-cols-1">
                <!-- Steps -->
                <div
                  v-for="step in steps"
                  :key="step.id"
                  class="flex flex-col items-center z-10 gap-20 lt-md:gap-10"
                >
                  <div class="w-40 h-40 bg-secondary-500 rounded-full flex-center shadow-soft">
                    <span class="text-white font-bold text-xl">{{ step.id }}</span>
                  </div>
                  <h3 class="text-20 leading-30 m-0 text-center text-#484c44">{{ step.title }}</h3>
                  <p class="text-16 leading-26 m-0 text-center text-#5a5a5a">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Inspirations -->
          <section class="" id="examples">
            <div class="text-center">
              <h2 class="text-5xl font-bold font-serif text-primary-700 mb-8 text-primary-700" lt-md="text-3xl">Inspirations</h2>
              <p class="text-neutral-600 mb-32">Browse other collections worth remembering.</p>
              <a href="#try" class="btn-secondary" @click="() => { analytics.trackClickGoPro(); selectRandomExcerpt(); keepThisExcerpt(); }">
                View AI Tools Inspirations
              </a>
            </div>
          </section>

          <!-- FAQ -->
          <section class="mb-64" id="faq">
            <div class="text-center mb-32">
              <h2 class="text-5xl font-bold font-serif text-primary-700 mb-8" lt-md="text-3xl">Frequently Asked Questions</h2>
              <p class="text-neutral-600 max-w-2xl mx-auto mb-32">Everything you need to know about using Bookleaf.</p>
            </div>
            <div class="max-w-3xl mx-auto flex flex-col gap-12">
              <!-- FAQ Items -->
              <div
                v-for="item in faqItems"
                :key="item.id"
                class="bg-#f9fafb rounded-10 cursor-pointer group"
              >
                <div
                  class="w-full px-16 py-20 flex justify-between items-center text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 rounded-xl"
                  @click="faqOpen = faqOpen === item.id ? 0 : item.id"
                >
                  <h3 class="text-14 text-primary-700 font-600 group-hover:color-#849975">{{ item.question }}</h3>
                  <svg
                    class="w-20 h-20 text-neutral-500 transition-all-300"
                    :class="faqOpen === item.id ? 'rotate-180 text-primary-600' : ''"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div
                  class="px-16 pb-20 pt-0 border-t rounded-b-10 transition-all-300"
                  :class="[faqOpen === item.id ? 'block' : 'hidden']"
                >
                  <p class="text-14 color-#6b7280">{{ item.answer }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="flex-c bg-primary-700 py-40">
      <div class="max-w-500 mx-auto flex items-center justify-center flex-col gap-20 color-#fff text-14 leading-18" lt-md="px-20 gap-12">
        <img
          :src="`${baseUrl}images/logo/Bookleaf-white.svg`"
          alt="Bookleaf Logo"
          class="h-20 vertical-align-middle"
        />
        <div>Vertical Movie Screenshot Stitcher</div>
        <div class="text-center">LineStack helps you stitch movie and TV show screenshots into vertical story images with preserved subtitles — free, private, and built for cinematic storytelling.</div>
        <div class="text-12 bg-primary-800 py-4 px-8 rounded-8 color-primary-500 text-center">Free Forever · No Sign-Up · Local Processing · Subtitle Preservation</div>
        <ul class="flex items-center gap-12">
          <li>
            <a href="#" class="hover:underline">Privacy</a>
          </li>
          <li>
            <a href="#" class="hover:underline">Terms</a>
          </li>
          <li>
            <a href="#" class="hover:underline">Contact</a>
          </li>
        </ul>
        <div class="text-12">© 2026 LineStack. All rights reserved.</div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Screen reader only utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
</style>
