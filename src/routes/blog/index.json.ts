import posts from "./_posts";

export function get(req, res) {
  const postsList = Array.from(posts.values()).map((post) => {
    return { title: post.title, slug: post.slug };
  });
  res.status(200).json({ posts: postsList });
}
