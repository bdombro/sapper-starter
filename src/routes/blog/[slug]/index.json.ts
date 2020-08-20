import posts from '../_posts'

export function get(req, res, next) {
  // the `slug` parameter is available because
  // this file is called [slug].json.js
  // console.dir(posts)
  const { slug } = req.params

  const post = posts.get(slug)
  if (post) {
    res.writeHead(200).end(JSON.stringify(post))
  } else {
    res.writeHead(404).end(JSON.stringify({ message: `Not found` }))
  }
}

export function patch(req, res, next) {
  const { slug } = req.params
  const post = posts.get(slug)
  if (post) {
    const postNext = { ...post, ...req.body }
    posts.set(slug, postNext)
    res.writeHead(200).end(JSON.stringify(postNext))
  } else {
    res.writeHead(404).end(JSON.stringify({ message: `Not found` }))
  }
}

// TODO: Make CRUD a pattern
// TODO: Validation

export function del(req, res, next) {
  const { slug } = req.params
  if (posts.has(slug)) {
    posts.delete(slug)
    res.writeHead(200).end(JSON.stringify({ success: true }))
  } else {
    res.writeHead(404).end(JSON.stringify({ message: `Not found` }))
  }
}
