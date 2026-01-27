export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const { gtmId } = config.public

  // Get baseURL from runtime config
  const baseURL = config.app.baseURL

  // Only load GTM in production environment (Tina's deployment with /bookleaf/ baseURL)
  const isProduction = baseURL === '/bookleaf/'

  // Skip if not in production or GTM ID not configured
  if (!isProduction || !gtmId) {
    return
  }

  // Inject Google Tag Manager script
  const gtmScript = document.createElement('script')
  gtmScript.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');
  `
  document.head.appendChild(gtmScript)

  // Inject GTM noscript iframe
  const noscript = document.createElement('noscript')
  const iframe = document.createElement('iframe')
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`
  iframe.height = '0'
  iframe.width = '0'
  iframe.style.display = 'none'
  iframe.style.visibility = 'hidden'
  noscript.appendChild(iframe)
  document.body.insertBefore(noscript, document.body.firstChild)
})
