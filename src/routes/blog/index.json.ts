import withCacheHandler from "../../lib/withCacheHandler"
import posts from "./_posts"

export const get = withCacheHandler({
  bodyBuilder: async () => {
    const postsList = Array.from(posts.values()).map((post) => {
      return { title: post.title, slug: post.slug }
    })
    return [200, JSON.stringify({ posts: postsList })]
  },
  isPublic: true,
})
