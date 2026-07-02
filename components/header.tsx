import Link from "next/link"

export const Header = () => (
  <header className="flex flex-row justify-between items-center">
    <div className="flex gap-2 text-sm">
      <h1 className="font-medium text-foreground/75">kaiden</h1>
      <span>/</span>
      <Link
        className="font-medium text-foreground/75 underline underline-offset-4"
        href="/"
      >
        0x424
      </Link>
    </div>
    <div className="flex flex-row gap-4 items-center justify-between">
      <span className="text-xs flex items-center gap-2">
        looking for work
        <span className="inline-flex h-3 w-3 relative bg-emerald-400/75">
          <span className="inline-flex h-3 w-3 animate-ping opacity-75 bg-emerald-400" />
        </span>
      </span>
      <span className="text-sm">tt</span>
    </div>
  </header>
)
