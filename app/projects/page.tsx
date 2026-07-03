import Image from "next/image"
import type { StaticImageData } from "next/image"
import { redirect } from "next/navigation"

import portfolioImage from "@/assets/portfolio.png"
import { cn } from "@/lib/utils"

const Tile = ({
  label,
  image,
  className,
  videoUrl,
}: {
  label: string
  image?: StaticImageData
  videoUrl?: string
  className?: string
}) => (
  <div
    className={cn(
      "relative flex items-center justify-center overflow-hidden border bg-muted/50 cursor-target",
      className
    )}
  >
    {image && (
      <Image
        alt={label}
        className="object-cover"
        fill
        src={image}
        quality={95}
      />
    )}
    {videoUrl && (
      <video
        className="h-full w-full object-center"
        aria-label="triple feedback project video"
        playsInline
        autoPlay
        muted
        loop
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    )}
    <span className="absolute bottom-3 left-3 border bg-background px-2 py-1 text-muted-foreground text-xs">
      {label}
    </span>
  </div>
)

export default function Page() {
  if (process.env.NODE_ENV !== "development") {
    redirect("/")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Tile
        className="min-h-56 lg:row-span-3"
        label="triple feedback loop"
        videoUrl="https://qg4jfsqsfxj4pwmc.public.blob.vercel-storage.com/triple-feedback-NiTKjzZu9G6yQThFPFw1oH1UzxDXyq.mp4"
      />
      <Tile className="min-h-56" label="portfolio" image={portfolioImage} />
      <div className="grid grid-cols-2 gap-4">
        <Tile className="min-h-36" label="Team" />
        <Tile label="Settings" />
      </div>
      <Tile className="min-h-36" label="Reports" />
    </div>
  )
}
