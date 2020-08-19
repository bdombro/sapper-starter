import posts from '../_posts'

export function post(req, res, next) {
  const { slug } = req.params
  if (posts.has(slug)) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    const next = posts.get(slug)
    next.likes++
    posts.set(next.slug, next)
    res.end(JSON.stringify(next))
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: `Not found` }))
  }
}
