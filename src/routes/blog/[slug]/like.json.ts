import posts from '../_posts'

export function post(req, res, next) {
  const { slug } = req.params
  if (posts.has(slug)) {
    const next = posts.get(slug)
    next.likes++
    posts.set(next.slug, next)
    res.writeHead(201).end(JSON.stringify(next))
  } else {
    res.writeHead(404).end(JSON.stringify({ message: `Not found` }))
  }
}
