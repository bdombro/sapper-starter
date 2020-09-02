import GETCache from "../../lib/GETCache"
import posts from "./_posts"

export const get = GETCache({
  bodyBuilder: async () => {
    const postsList = Array.from(posts.values()).map((post) => {
      return { title: post.title, slug: post.slug }
    })
    return [200, JSON.stringify({ posts: postsList })]
  },
  maxLife: 10000,
  staleWhenTtlLessThan: 5000,
  isPublic: true,
})
