import Etag from "etag" // this is included with expressjs and is actually used by default when using res.json

/**
 * A cache wrapper for API.GET endpoints
 *
 * - Caches responses for speedup
 * - Cache "hits" have max-life
 * - Uses ETag to match requests with cache
 * - Uses req.url to match requests with cache if isPublic = true
 * - On refresh, will still respond with 304 if body is unchanged
 */
const GETCache: GETCache = (bodyBuilder, options = {}) => {
  const { maxLife = 5000, isPublic = false } = options
  const cache = new Set<Hit>()
  return async (req, res, next) => {
    for (const [i, hit] of cache.entries()) {
      if (req.headers["skip-cache"]) break
      if (Date.now() > hit.expires) {
        cache.delete(i)
      }
      if (req.headers["if-none-match"] === hit.etag) {
        res.header("ETag", hit.etag)
        res.status(304).end()
        return
      }
      if (isPublic && req.url === hit.url) {
        res.header("ETag", hit.etag)
        res.status(200).end(hit.body)
        return
      }
    }
    const [status, body] = await bodyBuilder(req, res, next)
    if (status != 200) {
      res.status(status).end(body)
      return
    }
    const hit = {
      url: req.url,
      etag: Etag(body),
      expires: Date.now() + maxLife,
      body,
    }
    cache.add(hit)
    res.header("ETag", hit.etag)
    if (req.headers["if-none-match"] === hit.etag) {
      res.status(304).end()
      return
    }
    res.status(200).end(hit.body)
  }
}
export default GETCache

type GETCache = (
  // An async function that handles a GET request and returns a [status, body]
  bodyBuilder: BodyBuilder,
  options?: {
    // How long cache hits should last
    maxLife?: number
    // Allow requests without a matching ETag to use the cache. DONT do this if your page has any access-control/permissions
    isPublic?: boolean
  }
) => (req, res, next) => Promise<void>
type BodyBuilder = (
  req,
  res,
  next
) => Promise<
  [
    // The status code of the response (i.e. 200)
    number,
    // Normally a string (i.e. JSON), but sometimes a buffer (image)
    any
  ]
>
type Hit = { url: string; etag: string; expires: number; body: any }
