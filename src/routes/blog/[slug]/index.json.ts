import posts from "../_posts"
import type { IndexData } from "./_types"
import withCacheHandler from "../../../lib/withCacheHandler"

export const get = withCacheHandler({
  bodyBuilder: async (req) => {
    const post: IndexData['post'] = posts.get(req.params.slug)
    if (post) {
      const data: IndexData = { post }
      return [200, JSON.stringify(data)]
    }
    return [404, null]
  },
  isPublic: true,
  maxLife: 30 * 60 * 1000,
  staleWhenTtlLessThan: 15 * 60 * 1000,
  browserCache: false,
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
