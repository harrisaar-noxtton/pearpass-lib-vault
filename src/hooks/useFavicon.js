import { useState, useEffect, useCallback } from 'react'

import { pearpassVaultClient } from '../instances'

/**
 * Hook to fetch and manage favicon state for a given URL
 * @param {{ url: string }} params - Parameters object containing the URL
 * @returns {{
 *   faviconSrc: string | null,
 *   isLoading: boolean,
 *   error: string | null
 * }}
 */
export const useFavicon = (params) => {
  const { url } = params
  const [faviconSrc, setFaviconSrc] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadFavicon = useCallback(async () => {
    console.log(`[useFavicon] loadFavicon called for ${url}`)

    if (!url) {
      console.log(`[useFavicon] Aborting load: No URL provided`)
      setFaviconSrc(null)
      setIsLoading(false)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (!pearpassVaultClient) {
        throw new Error('Pearpass vault client is not initialized')
      }

      console.log(`[useFavicon] Calling vaultClient fetchFavicon for ${url}`)
      const res = await pearpassVaultClient.fetchFavicon(url)
      console.log(`[useFavicon] vaultClient response for ${url}:`, res ? 'SUCCESS' : 'NULL')

      if (res && res.favicon) {
        setFaviconSrc(res.favicon)
        setError(null)
      } else {
        setFaviconSrc(null)
        setError('Unknown error: No favicon returned')
      }
    } catch (err) {
      console.error(`[useFavicon] Error for ${url}:`, err)
      setFaviconSrc(null)
      setError(err.message || err.toString())
    } finally {
      console.log(`[useFavicon] Finally block for ${url}. Setting isLoading false.`)
      setIsLoading(false)
    }
  }, [url])

  useEffect(() => {
    console.log(`[useFavicon] useEffect mounted/updated for ${url}`)
    loadFavicon()
  }, [loadFavicon])

  return { faviconSrc, isLoading, error, retry: loadFavicon }
}
