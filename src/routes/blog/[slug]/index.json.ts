import posts from "../_posts"
import type { IndexData } from "./_types"
import withCacheHandler from "../../../lib/withCacheHandler"

export const get = withCacheHandler({
  bodyBuilder: async (req) => {
    const post = posts.get(req.params.slug)
    if (post) {
      const data: IndexData = { post }
      return [200, JSON.stringify(data)]
    }
    return [404, null]
  },
  isPublic: true,
  maxLife: 20000,
  staleWhenTtlLessThan: 15000,
})

export function patch(req, res) {
  if (req.auth?.i) {
    const post = posts.get(req.params.slug)
    const postNext = { ...post, ...req.body }
    posts.set(post.slug, postNext)
    res.status(200).json(postNext)
  } else {
    res.status(403).end()
  }
}
