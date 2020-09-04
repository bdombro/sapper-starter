import Etag from "etag"
import { waitFor } from "./wait" // this is included with expressjs and is actually used by default when using res.json

const debug = true

/**
 * A cache wrapper for API.GET endpoints
 *
 * - Caches responses for speedup based on ETags and URL
 * - Fast: Responses are cached in-memory using a Map
 * - Max-life: Cache entries have max-life and will be purged on expire
 * - Stale-while-refresh: When a cache entry is requested near the end of it's
 *   life (aka stale), return the stale and refresh in background
 * - Race condition handling: Will wait for like requests to finish and return
 *   the result from the like request instead of re-trying
 * - Semi-Secure: Won't match by req.url if isPublic = false. That said, Chrome shares ETag across windows even if incog.
 * - Efficient: Will respond with 304 indefinitely as long as response unchanged
 * - Bypass: Will trash the cache if "skip-cache" header is true
 * - Purgable: Can be purged or accessible from anywhere using exported resultCache
 */
const withCacheHandler: WithCacheHandler = (
  {
    bodyBuilder,
    maxLife = 5000,
    staleWhenTtlLessThan = 3000,
    isPublic = false,
    browserCache = true,
  }
  : GetCacheHandlerOptions
) => {
  const cacheHandler = new GetCacheHandler({bodyBuilder, maxLife, staleWhenTtlLessThan, isPublic})
  return async (req, res, next) => {
    try {
      let result = await cacheHandler.getFreshFromContext({ req, res, next })
      res.header("ETag", `"${result.etag}"`)

      if (browserCache) {
        if (isPublic) res.header("Cache-Control", "public")
        res.header("Expires", new Date(Math.abs(result.expires - staleWhenTtlLessThan)).toUTCString())
      }
      else res.header("Expires", new Date().toUTCString()) // expires now

      if (result.etag === sanitizeEtag(req.headers["if-none-match"])) {
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
export default withCacheHandler

/**
 * An in-memory cache. Ideal for low-scale apps, but you may consider a shared cache
 * for high-scale.
 */
class ResultCache {
  // garbageCollectorInterval: This number can be high b/c this.get checks expires
  private garbageCollectorInterval = 100 //10 * 60 * 1000
  private cache = new Map<CacheEntry["etag"], CacheEntry>()
  private urlToEtag = new Map<CacheEntry["url"], CacheEntry["etag"]>()

  constructor() {
    setInterval(this.garbageCollector.bind(this), this.garbageCollectorInterval)
  }

  public get(etag: CacheEntry['etag']) {
    const entry = etag && this.cache.get(sanitizeEtag(etag))
    if (entry) {
      const ttl = entry.expires - Date.now()
      if (ttl <= 0) {
        // maybe instead of deleting we should lock, so that other racing requests don't plow ahead before this request is done
        this.release(entry)
        return
      }
    }
    return entry
  }
  public getByUrl(url: CacheEntry['url']) {
    const etag = this.urlToEtag.get(url),
          entry = this.get(etag)
    return entry
  }
  public set(entry: CacheEntry) {
    entry.etag = sanitizeEtag(entry.etag)
    this.urlToEtag.set(entry.url, entry.etag)
    this.cache.set(entry.etag, entry)
  }
  public release(entry: CacheEntry) {
    if (debug) console.debug("ResultCache: Releasing " + entry.etag)
    this.urlToEtag.delete(entry.url)
    this.cache.delete(entry.etag)
  }
  public lock(entry: CacheEntry) {
    resultCache.set({ ...entry, lock: true })
  }
  public unlock(entry: CacheEntry) {
    resultCache.set({ ...entry, lock: false })
  }
  public releaseByUrl(url: CacheEntry['url']) {
    for (const entry of this.cache.values()) {
      if (entry.url === url) {
        this.release(entry)
      }
    }
  }
  private garbageCollector() {
    for (const entry of this.cache.values()) {
      if (!entry.lock) {
        const ttl = entry.expires - Date.now()
        if (ttl <= 0) {
          this.release(entry)
        }
      }
    }
  }
}
export const resultCache = new ResultCache()


/**
 * Handle the cache in an efficient, de-duping, debouncing, performant way
 *
 * If cached and locked: This means another renew is already running for this request. Instead of renewing twice, resolve to the result of the matching request.
 * If uncached: Create a lock on the request, fulfill it, and save the result to cache
 *
 */
class GetCacheHandler {
  private options: GetCacheHandlerOptions

  constructor(options: GetCacheHandlerOptions) {
    this.options = options
  }

  public async getFreshFromContext(context: ExpressContext): Promise<CacheEntry> {
    const { req } = context
    const etag = req.headers['if-none-match']
    const skipCache = req.headers['skip-cache']
    const getExisting = () => resultCache.get(etag) || (this.options.isPublic && resultCache.getByUrl(req.url))

    if (!skipCache) {
      const existing = getExisting()
      if (existing) {
        // If locked: This means another renew is already running for this request. Instead of renewing twice, resolve to the result of the matching request.
        if (existing.lock) {
          const getReadyOrError = () => {
            const existing = getExisting()
            if (existing.lock) throw new waitFor.NotReadyException()
            return existing
          }
          const result = await waitFor(getReadyOrError, { interval: 100, timeout: 60000 })
          return result
        }
        // If stale, renew in background and return the stale
        const ttl = existing.expires - Date.now()
        if (ttl < this.options.staleWhenTtlLessThan) {
          if (debug) console.log('GetCacheHandler: stale')
          this.renew(context)
        }
        return existing
      }
    }

    const result = this.renew(context)
    return result
  }

  private async renew(context: ExpressContext) {
    const {req, res} = context
    if (debug) console.debug(`GetCacheHandler.renew: ${req.url}`)
    const etag = req.headers['if-none-match']

    // Create a lock in the cache for this request
    resultCache.set({
      url: req.url,
      etag: etag || '',
      expires: 9999999999999,
      body: '',
      lock: true,
    })

    // Fulfill the request
    const [status, body] = await this.options.bodyBuilder(req, res)
    if (status != 200) throw { error: { status, body } }
    const result: CacheEntry = {
      url: req.url,
      etag: Etag(body),
      expires: Date.now() + this.options.maxLife,
      body,
      lock: false,
    }
    resultCache.set(result)
    console.log("renewed")
    return result
  }
}

function sanitizeEtag(etag: string) {
  const etagNext = etag
    ?.replace("W/", '') // Cloudflare adds W/ automatically
    ?.replace(/"/g, '') // Cloudflare expects the eTag to be in quotes
  return etagNext
}



interface ExpressContext {
  req: any
  res: any
  next: any
}
type WithCacheHandler = (
  options: GetCacheHandlerOptions
) => (req, res, next) => Promise<void>
type BodyBuilder = (req, res) => Promise<BodyBuilderResponse>
type BodyBuilderResponse = [
  // The status code of the response (i.e. 200)
  status: number,
  // Normally a string (i.e. JSON), but sometimes a buffer (image)
  body: any
]
interface GetCacheHandlerOptions {
  // An async function that handles a GET request and returns a [status, body]
  bodyBuilder: BodyBuilder
  // How long cache hits should last
  maxLife?: number
  // When to consider stale ahead of cache expiration (aka time-to-live ttl). This will trigger a refresh in background
  staleWhenTtlLessThan?: number
  // Allow requests without a matching ETag to use the cache. DONT do this if your page has any access-control/permissions
  isPublic?: boolean
  // Whether to tell the browser to cache or not
  browserCache?: boolean
}
interface CacheEntry {
  url: string
  etag: string
  expires: number
  body: any
  lock: boolean
}
