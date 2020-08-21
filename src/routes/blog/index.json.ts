import posts from "./_posts";

export function get(req, res) {
  const contents = Array.from(posts.values()).map((post) => {
    return {
      title: post.title,
      slug: post.slug,
    };
  });
  res.status(200).json(contents);
}

export function post(req, res) {
  const postNext = req.body;
  if (posts.has(postNext.slug)) {
    posts.set(postNext.slug, postNext);
    res.writeHead(201).end(JSON.stringify(postNext));
  } else {
    res.status(400).json({ message: `Record with that slug already exists` });
  }
}
