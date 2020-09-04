import posts from "../_posts"
import { resultCache } from "../../../lib/withCacheHandler"

export function post(req, res) {
  const { slug } = req.params
  if (posts.has(slug)) {
    const next = posts.get(slug)
    next.likes++
    posts.set(next.slug, next)
    resultCache.releaseByUrl(req.url.replace('/like', ''))
    resultCache.releaseByUrl('/blog.json')
    res.status(201).json(next)
  } else {
    res.status(404).json({ error: `Not found` })
  }
}
