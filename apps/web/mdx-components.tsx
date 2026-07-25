import type { MDXComponents } from "mdx/types"

export const useMDXComponents = (components: MDXComponents): MDXComponents => ({
  a: ({ children, ...props }) => (
    <a className="underline underline-offset-4" {...props}>
      {children}
    </a>
  ),
  blockquote: (props) => (
    <blockquote
      className="border-l-2 border-muted-foreground pl-4 text-muted-foreground"
      {...props}
    />
  ),
  code: (props) => <code className="bg-muted px-1 text-xs" {...props} />,
  h1: ({ children, ...props }) => (
    <h1 className="text-lg font-medium" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-sm font-medium" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-sm font-medium" {...props}>
      {children}
    </h3>
  ),
  hr: () => <hr className="border-border" />,
  li: (props) => (
    <li className="flex flex-row items-start gap-2">
      <span aria-hidden>{"<>"}</span>
      <span {...props} />
    </li>
  ),
  ol: (props) => <ol className="flex flex-col gap-2" {...props} />,
  p: (props) => <p className="leading-relaxed" {...props} />,
  pre: (props) => (
    <pre className="overflow-x-auto border p-3 text-xs" {...props} />
  ),
  ul: (props) => <ul className="flex flex-col gap-2" {...props} />,
  ...components,
})
