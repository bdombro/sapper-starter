import withCacheHandler from "../../lib/withCacheHandler"
import posts from "./_posts"
import type { IndexData } from "./_types"
import { map, pick, pipedAsync } from "rambdax"

export const get = withCacheHandler({
  bodyBuilder: async () => {
    const result: IndexData = {
      posts: await pipedAsync(
        posts.values(),
        Array.from,
        map(pick(['title', 'slug', 'likes'])),
      )
    }
    return [200, JSON.stringify(result)]
  },
  isPublic: true,
  maxLife: 30 * 60 * 1000,
  staleWhenTtlLessThan: 15 * 60 * 1000,
  browserCache: false
})