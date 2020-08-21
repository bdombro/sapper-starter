import posts from "../_posts";

export function get(req, res) {
  const { slug } = req.params;

  const post = posts.get(slug);
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json({ message: `Not found` });
  }
}

export function patch(req, res) {
  const { slug } = req.params;
  const post = posts.get(slug);
  if (post) {
    const postNext = { ...post, ...req.body };
    posts.set(slug, postNext);
    res.status(200).json(postNext);
  } else {
    res.status(404).json({ message: `Not found` });
  }
}

// TODO: Make CRUD a pattern
// TODO: Validation

export function del(req, res) {
  const { slug } = req.params;
  if (posts.has(slug)) {
    posts.delete(slug);
    res.status(200).json({ success: true });
  } else {
    res.status(404).json({ message: `Not found` });
  }
}
