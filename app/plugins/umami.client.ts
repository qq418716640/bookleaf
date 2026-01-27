export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const { umamiHost, umamiId } = config.public

  // Skip if not configured
  if (!umamiHost || !umamiId) {
    return
  }

  // Create and inject Umami script
  const script = document.createElement('script')
  script.async = true
  script.defer = true
  script.src = `${umamiHost}/script.js`
  script.setAttribute('data-website-id', umamiId)

  document.head.appendChild(script)
})
