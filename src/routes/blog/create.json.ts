import posts from "./_posts";

export function post(req, res) {
  const postNext = req.body;
  if (posts.has(postNext.slug)) {
    posts.set(postNext.slug, postNext);
    res.writeHead(201).end(JSON.stringify(postNext));
  } else {
    res.status(400).json({ error: `Record with that slug already exists` });
  }
}
