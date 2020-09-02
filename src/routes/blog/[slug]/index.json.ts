import posts from "../_posts"
import type { IndexData } from "./_types"
import GETCache from "../../../lib/GETCache"

export const get = GETCache({
  bodyBuilder: async (req, res) => {
    const post = posts.get(req.params.slug)
    if (post) {
      const data: IndexData = { post }
      return [200, JSON.stringify(data)]
    }
    return [404, null]
  },
  isPublic: true,
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
