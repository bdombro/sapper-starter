import posts from "../_posts";
import type { IndexData } from "./_types";

export function get(req, res) {
  const post = posts.get(req.params.slug);
  if (post) {
    const data: IndexData = { post };
    res.status(200).json(data);
  } else res.status(404).json();
}

export function patch(req, res) {
  if (req.auth?.i) {
    const post = posts.get(req.params.slug);
    const postNext = { ...post, ...req.body };
    posts.set(post.slug, postNext);
    res.status(200).json(postNext);
  } else {
    res.status(403).end();
  }
}
