import Link from "next/link"

import type { Post } from "@/app/writing/posts"
import { posts } from "@/app/writing/posts"

export const PostItem = ({ post }: { post: Post }) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between items-center w-full">
      <h3 className="font-medium">{post.title}</h3>
      <span className="font-light text-muted-foreground text-xs">
        {post.date}
      </span>
    </div>
    <Link
      className="text-sm underline underline-offset-4"
      href={`/writing/${post.slug}`}
    >
      {post.description}
    </Link>
  </div>
)

export const Writing = () => (
  <section className="flex flex-col">
    <div className="flex flex-row justify-between items-center pb-2">
      <h2 className="text-lg font-medium">writing</h2>
      <Link
        className="text-xs text-muted-foreground underline underline-offset-4"
        href="/writing"
      >
        {"all posts ->"}
      </Link>
    </div>

    <div className="flex flex-col gap-4 text-sm">
      {posts.slice(0, 5).map((post) => (
        <PostItem key={post.slug} post={post} />
      ))}
    </div>
  </section>
)
