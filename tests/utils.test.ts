import { describe, expect, it } from "vitest"

import { cn } from "@/lib/utils"

describe("cn", () => {
  it("joins plain class name strings", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1")
  })

  it("drops falsy values", () => {
    expect(cn("px-2", false, undefined, null, "py-1")).toBe("px-2 py-1")
  })

  it("applies conditional object syntax", () => {
    expect(cn("base", { active: true, hidden: false })).toBe("base active")
  })

  it("flattens arrays of class values", () => {
    expect(cn(["px-2", "py-1"], "text-sm")).toBe("px-2 py-1 text-sm")
  })

  it("merges conflicting tailwind classes, keeping the last one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
  })

  it("merges conflicting tailwind classes across conditional groups", () => {
    expect(cn("text-red-500", { "text-blue-500": true })).toBe("text-blue-500")
  })

  it("returns an empty string when given nothing usable", () => {
    expect(cn()).toBe("")
    expect(cn(false, undefined, null)).toBe("")
  })
})
