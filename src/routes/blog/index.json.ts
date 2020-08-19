import posts from './_posts'

export function get(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  const contents = JSON.stringify(
    Array.from(posts.values()).map((post) => {
      return {
        title: post.title,
        slug: post.slug,
      }
    }),
  )
  res.end(contents)
}

export function post(req, res, next) {
  req.on('data', (data, err) => {
    if (err) res.status(404).send({ error: 'invalid json' })
    const next = JSON.parse(data)
    if (posts.has(next.slug)) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      posts.set(next.slug, next)
      res.end(JSON.stringify(next))
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({ message: `Record with that slug already exists` }),
      )
    }
  })
}
