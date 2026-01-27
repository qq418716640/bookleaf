/**
 * Get the base URL from runtime config
 */
export function useBaseUrl(): string {
  const config = useRuntimeConfig()
  return config.app.baseURL || '/'
}

/**
 * Resolve a path with the base URL
 */
export function withBase(path: string): string {
  const baseUrl = useBaseUrl()
  // Remove leading slash from path if baseUrl ends with slash
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'
  return cleanBase + cleanPath
}
