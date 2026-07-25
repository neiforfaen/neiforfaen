import { renderToString } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Cursor } from "@/components/cursor"

describe("Cursor", () => {
  it("renders nothing on the server so mobile devices never get a ghost cursor", () => {
    expect(renderToString(<Cursor />)).toBe("")
  })
})
