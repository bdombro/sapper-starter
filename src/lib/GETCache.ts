import Etag from "etag"
import { waitFor } from "./wait" // this is included with expressjs and is actually used by default when using res.json

/**
 * A cache wrapper for API.GET endpoints
 *
 * - Caches responses for speedup
 * - Cache "hits" have max-life
 * - Uses ETag to match requests with cache
 * - Uses req.url to match requests with cache if isPublic = true
 * - On refresh, will still respond with 304 if body is unchanged
 * - Will trash the cache if "skip-cache" header is true
 */
const GETCache: GETCacheType = (options: GETCacheCacheOptions) => {
  const cache = new GETCacheCache(options)
  return async (req, res, next) => {
    try {
      let result = await cache.getFreshFromContext({ req, res, next })
      res.header("ETag", result.etag)

      if (result.etag === req.headers["if-none-match"]) {
        res.status(304).end()
      } else {
        res.status(200).end(result.body)
      }
    } catch (e) {
      if (e.error) res.status(e.error.status).end(e.error.body)
      else throw e
    }
  }
}
export default GETCache

class GETCacheCache {
  private cache = new Map<GETCacheCacheEntry["etag"], GETCacheCacheEntry>()
  private urlToEtag = new Map<
    GETCacheCacheEntry["url"],
    GETCacheCacheEntry["etag"]
  >()
  public options: GETCacheCacheOptions

  constructor(options: GETCacheCacheOptions) {
    this.options = options
  }

  public deleteExpired() {
    for (const [etag, entry] of this.cache.entries()) {
      if (!entry.lock) {
        const ttl = entry.expires - Date.now()
        if (ttl <= 0) this.unset(etag)
      }
    }
  }

  public async getFreshFromContext(context: ExpressContext) {
    this.deleteExpired()
    const result = context.req.headers["skip-cache"]
      ? await this.renew(context)
      : this.getMatchFromContext(context) ?? (await this.renew(context))
    this.refreshMatchInBackgroundIfStale(context, result) // ignore promise so non-blocking
    return result
  }

  public getMatchFromContext(context: ExpressContext) {
    const { req } = context
    const etag =
      req.headers["if-none-match"] ??
      (this.options.isPublic && this.urlToEtag.get(req.url))
    const match = etag && this.cache.get(etag)
    return match
  }

  public unset(etag: GETCacheCacheEntry["etag"]) {
    const match = this.cache.get(etag)
    if (match) {
      this.urlToEtag.delete(match.url)
      this.cache.delete(etag)
    }
  }

  public async renew(context: ExpressContext): Promise<GETCacheCacheEntry> {
    const { req, res } = context
    const etag = req.headers["if-none-match"]
    // console.debug(`GETCache.renew: ${req.url}`)

    // Lock cached etag if exists and return fulfilled result
    const existing = etag && this.cache.get(etag)
    if (existing) {
      if (existing.lock) {
        const getFulfilled = () => {
          const existing = this.cache.get(etag)
          if (existing.lock) throw 0
          return existing
        }
        return await waitFor(getFulfilled, { interval: 100, timeout: 10000 })
      }
      this.cache.set(etag, { ...existing, lock: true })
    }

    const [status, body] = await this.options.bodyBuilder(req, res)
    if (status != 200) throw { error: { status, body } }
    const result: GETCacheCacheEntry = {
      url: req.url,
      etag: Etag(body),
      expires: Date.now() + this.options.maxLife,
      body,
      lock: false,
    }
    this.cache.set(result.etag, result)
    return result
  }

  public refreshMatchInBackgroundIfStale(
    context: ExpressContext,
    match: GETCacheCacheEntry
  ) {
    const ttl = match.expires - Date.now()
    if (ttl < this.options.staleWhenTtlLessThan) {
      // console.debug(`GETCache.refreshMatchInBackgroundIfStale: ${match.url} ${ttl}`)
      this.renew(context).catch((e) => {
        if (e.error)
          console.error(
            `GETCache: Prefetch failed for ${match.url} with ${e.error}`
          )
        else throw e
      })
    }
  }
}

interface ExpressContext {
  req: any
  res: any
  next: any
}
type GETCacheType = (
  options: GETCacheCacheOptions
) => (req, res, next) => Promise<void>
type BodyBuilder = (req, res) => Promise<BodyBuilderResponse>
type BodyBuilderResponse = [
  // The status code of the response (i.e. 200)
  status: number,
  // Normally a string (i.e. JSON), but sometimes a buffer (image)
  body: any
]
interface GETCacheCacheOptions {
  // An async function that handles a GET request and returns a [status, body]
  bodyBuilder: BodyBuilder
  // How long cache hits should last
  maxLife: number
  // When to consider stale ahead of cache expiration (aka time-to-live ttl). This will trigger a refresh in background
  staleWhenTtlLessThan: number
  // Allow requests without a matching ETag to use the cache. DONT do this if your page has any access-control/permissions
  isPublic: boolean
}
interface GETCacheCacheEntry {
  url: string
  etag: string
  expires: number
  body: any
  lock: boolean
}
