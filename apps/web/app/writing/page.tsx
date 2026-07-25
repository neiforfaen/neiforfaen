import type { Metadata } from "next"

import { PostItem } from "@/components/writing"
import { createMetadata } from "@/lib/metadata"

import { posts } from "./posts"

export const metadata: Metadata = createMetadata({
  description: "Notes on building software, frontend craft, and whatever else.",
  title: "writing",
})

export default function Page() {
  return (
    <section className="flex flex-col gap-8">
      <h2 className="text-lg font-medium">writing</h2>

      {posts.map((post) => (
        <PostItem key={post.slug} post={post} />
      ))}
    </section>
  )
}
