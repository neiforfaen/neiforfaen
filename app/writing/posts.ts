// oxlint-disable eslint/no-warning-comments
// TODO: hand-maintained index, newest first at the top. Generate from fs when it grows past a screenful.
export interface Post {
  slug: string
  title: string
  description: string
  date: string
}

export const posts: Post[] = [
  {
    date: "jul '26",
    description:
      "How I build small, fast CLI tools and keep dependencies to a minimum.",
    slug: "building-lightweight-cli-tools",
    title: "building lightweight CLI tools",
  },
]
