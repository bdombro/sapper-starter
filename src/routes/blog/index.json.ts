import withCacheHandler from "../../lib/withCacheHandler"
import posts from "./_posts"
import type { IndexData } from "./_types"
import pick from "../../lib/pick"

export const get = withCacheHandler({
  bodyBuilder: async () => {
    const postsList: IndexData['posts'] = Array.from(posts.values()).map((post) => {
      const listPost = pick(post, ['title', 'slug', 'likes'])
      return listPost
    })
    const result: IndexData = { posts: postsList }
    return [200, JSON.stringify(result)]
  },
  isPublic: true,
  maxLife: 30 * 60 * 1000,
  staleWhenTtlLessThan: 15 * 60 * 1000,
  browserCache: false
})