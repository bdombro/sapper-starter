export interface Post {
  title: string
  slug: string
  likes: number
  html: string
}

export interface IndexData {
  posts: Pick<Post, 'title'|'slug'|'likes'>[]
}