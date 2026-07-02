"use client"

import { animate, motion, useMotionValue, useSpring } from "motion/react"
import { useEffect, useMemo, useRef } from "react"

import { cn } from "@/lib/utils"

// A position: fixed element is positioned relative to the viewport UNLESS an
// ancestor establishes a containing block (transform, perspective, filter,
// will-change of those, or contain). When that happens, the cursor's translate
// no longer maps to viewport coordinates, so we measure and compensate for it.
const getContainingBlock = (
  element: HTMLElement | null
): HTMLElement | null => {
  let node = element?.parentElement ?? null
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node)
    if (
      style.transform !== "none" ||
      style.perspective !== "none" ||
      style.filter !== "none" ||
      style.willChange.includes("transform") ||
      style.willChange.includes("perspective") ||
      style.willChange.includes("filter") ||
      /paint|layout|strict|content/u.test(style.contain)
    ) {
      return node
    }
    node = node.parentElement
  }
  return null
}

const getContainingBlockOffset = (block: HTMLElement | null) => {
  if (!block) {
    return { x: 0, y: 0 }
  }
  const rect = block.getBoundingClientRect()
  return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop }
}

const CORNER_SIZE = 12
// How far outside the hovered target's box the corner frame sits.
const FRAME_PADDING = 4

// Corner order: top-left, top-right, bottom-right, bottom-left. At rest the
// four corners tile a seamless 2×2 square centred on the cursor — edge to
// edge, no gaps, no overlap. Their position is driven entirely through
// motion's x/y — Tailwind translate-* classes would stack with it (v4 uses
// the separate `translate` property).
const CORNER_HOME_POSITIONS = [
  { className: "border-r-0 border-b-0", x: -CORNER_SIZE, y: -CORNER_SIZE },
  { className: "border-b-0 border-l-0", x: 0, y: -CORNER_SIZE },
  { className: "border-t-0 border-l-0", x: 0, y: 0 },
  { className: "border-t-0 border-r-0", x: -CORNER_SIZE, y: 0 },
]

export interface CursorProps {
  targetSelector?: string
  hideDefaultCursor?: boolean
  hoverDuration?: number
  parallaxOn?: boolean
  cursorColor?: string
  cursorColorOnTarget?: string
}

export const Cursor = ({
  targetSelector = ".cursor-target",
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true,
  cursorColor = "#ffffff",
  cursorColorOnTarget,
}: CursorProps) => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  // ponytail: stiff spring ≈ the original's 0.1s power3.out follow tween
  const x = useSpring(rawX, { damping: 70, stiffness: 1000 })
  const y = useSpring(rawY, { damping: 70, stiffness: 1000 })
  const scale = useMotionValue(1)

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") {
      return false
    }
    const hasTouchScreen =
      "ontouchstart" in window || navigator.maxTouchPoints > 0
    const isSmallScreen = window.innerWidth <= 768
    const isMobileUserAgent =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/iu.test(
        navigator.userAgent
      )
    return (hasTouchScreen && isSmallScreen) || isMobileUserAgent
  }, [])

  useEffect(() => {
    const cursor = cursorRef.current
    if (isMobile || !cursor) {
      return
    }

    // A stylesheet rule beats the UA's per-element cursors (links get
    // cursor: pointer) and reaches outside body's box, unlike body.style.
    let cursorStyle: HTMLStyleElement | null = null
    if (hideDefaultCursor) {
      cursorStyle = document.createElement("style")
      cursorStyle.textContent = "* { cursor: none !important }"
      document.head.append(cursorStyle)
    }

    const corners = [
      ...cursor.querySelectorAll<HTMLDivElement>(".target-cursor-corner"),
    ]

    const moveCornersHome = (duration: number) => {
      for (const [i, corner] of corners.entries()) {
        const home = CORNER_HOME_POSITIONS[i]
        if (home) {
          animate(
            corner,
            { x: home.x, y: home.y },
            { duration, ease: "easeOut" }
          )
        }
      }
    }
    // Seed motion's x/y so the first hover animates from the resting diamond
    // instead of from 0,0 (motion can't parse the inline transform).
    moveCornersHome(0)

    let containingBlock = getContainingBlock(cursor)
    const getOffset = () => getContainingBlockOffset(containingBlock)

    const initialOffset = getOffset()
    rawX.jump(window.innerWidth / 2 - initialOffset.x)
    rawY.jump(window.innerHeight / 2 - initialOffset.y)
    x.jump(window.innerWidth / 2 - initialOffset.x)
    y.jump(window.innerHeight / 2 - initialOffset.y)

    let activeTarget: Element | null = null
    let currentLeaveHandler: (() => void) | null = null
    let targetCorners: { x: number; y: number }[] | null = null
    let unsubscribeFollow: (() => void) | null = null

    const cleanupTarget = (target: Element) => {
      if (currentLeaveHandler) {
        target.removeEventListener("mouseleave", currentLeaveHandler)
      }
      currentLeaveHandler = null
      unsubscribeFollow?.()
      unsubscribeFollow = null
    }

    const setCursorColor = (color: string) => {
      for (const corner of corners) {
        animate(
          corner,
          { borderColor: color },
          { duration: 0.15, ease: "easeOut" }
        )
      }
      if (dotRef.current) {
        animate(
          dotRef.current,
          { backgroundColor: color },
          { duration: 0.15, ease: "easeOut" }
        )
      }
    }

    const moveCornersToTarget = (duration: number) => {
      const positions = targetCorners
      if (!positions) {
        return
      }
      for (const [i, corner] of corners.entries()) {
        const position = positions[i]
        if (position) {
          animate(
            corner,
            { x: position.x - x.get(), y: position.y - y.get() },
            { duration, ease: "easeOut" }
          )
        }
      }
    }

    const moveHandler = (e: MouseEvent) => {
      const offset = getOffset()
      rawX.set(e.clientX - offset.x)
      rawY.set(e.clientY - offset.y)
    }
    window.addEventListener("mousemove", moveHandler)

    const scrollHandler = () => {
      if (!activeTarget) {
        return
      }
      const offset = getOffset()
      const elementUnderMouse = document.elementFromPoint(
        x.get() + offset.x,
        y.get() + offset.y
      )
      const isStillOverTarget =
        elementUnderMouse &&
        (elementUnderMouse === activeTarget ||
          elementUnderMouse.closest(targetSelector) === activeTarget)
      if (!isStillOverTarget) {
        currentLeaveHandler?.()
      }
    }
    window.addEventListener("scroll", scrollHandler, { passive: true })

    const mouseDownHandler = () => {
      if (dotRef.current) {
        animate(dotRef.current, { scale: 0.7 }, { duration: 0.3 })
      }
      animate(scale, 0.9, { duration: 0.2 })
    }
    const mouseUpHandler = () => {
      if (dotRef.current) {
        animate(dotRef.current, { scale: 1 }, { duration: 0.3 })
      }
      animate(scale, 1, { duration: 0.2 })
    }
    window.addEventListener("mousedown", mouseDownHandler)
    window.addEventListener("mouseup", mouseUpHandler)

    const enterHandler = (e: MouseEvent) => {
      const target = (e.target as Element).closest(targetSelector)
      if (!target) {
        // Self-heal: mouseleave never fires when the active target is
        // removed from the DOM (e.g. clicking it navigates), which strands
        // the corners at the stale frame. Dismiss on the next hover outside.
        if (
          activeTarget &&
          (!activeTarget.isConnected ||
            !activeTarget.contains(e.target as Node))
        ) {
          currentLeaveHandler?.()
        }
        return
      }
      if (target === activeTarget) {
        return
      }
      if (activeTarget) {
        cleanupTarget(activeTarget)
      }

      activeTarget = target

      if (cursorColorOnTarget) {
        setCursorColor(cursorColorOnTarget)
      }

      const rect = target.getBoundingClientRect()
      const offset = getOffset()
      targetCorners = [
        {
          x: rect.left - FRAME_PADDING - offset.x,
          y: rect.top - FRAME_PADDING - offset.y,
        },
        {
          x: rect.right + FRAME_PADDING - CORNER_SIZE - offset.x,
          y: rect.top - FRAME_PADDING - offset.y,
        },
        {
          x: rect.right + FRAME_PADDING - CORNER_SIZE - offset.x,
          y: rect.bottom + FRAME_PADDING - CORNER_SIZE - offset.y,
        },
        {
          x: rect.left - FRAME_PADDING - offset.x,
          y: rect.bottom + FRAME_PADDING - CORNER_SIZE - offset.y,
        },
      ]

      moveCornersToTarget(hoverDuration)
      // Keep the corners pinned to the target while the cursor keeps moving;
      // the small duration is what produces the parallax lag.
      const follow = () => moveCornersToTarget(parallaxOn ? 0.2 : 0)
      const unsubX = x.on("change", follow)
      const unsubY = y.on("change", follow)
      unsubscribeFollow = () => {
        unsubX()
        unsubY()
      }

      const leaveHandler = () => {
        targetCorners = null
        activeTarget = null

        if (cursorColorOnTarget) {
          setCursorColor(cursorColor)
        }
        moveCornersHome(0.3)
        cleanupTarget(target)
      }
      currentLeaveHandler = leaveHandler
      target.addEventListener("mouseleave", leaveHandler)
    }
    window.addEventListener("mouseover", enterHandler as EventListener)

    const resizeHandler = () => {
      containingBlock = getContainingBlock(cursor)
    }
    window.addEventListener("resize", resizeHandler)

    return () => {
      window.removeEventListener("mousemove", moveHandler)
      window.removeEventListener("mouseover", enterHandler as EventListener)
      window.removeEventListener("scroll", scrollHandler)
      window.removeEventListener("resize", resizeHandler)
      window.removeEventListener("mousedown", mouseDownHandler)
      window.removeEventListener("mouseup", mouseUpHandler)
      if (activeTarget) {
        cleanupTarget(activeTarget)
      }
      cursorStyle?.remove()
    }
  }, [
    targetSelector,
    hideDefaultCursor,
    isMobile,
    hoverDuration,
    parallaxOn,
    cursorColor,
    cursorColorOnTarget,
    rawX,
    rawY,
    x,
    y,
    scale,
  ])

  if (isMobile) {
    return null
  }

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-9999 h-0 w-0"
      ref={cursorRef}
      style={{ scale, x, y }}
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-1 w-1 rounded-full"
        ref={dotRef}
        style={{ backgroundColor: cursorColor }}
      />
      {CORNER_HOME_POSITIONS.map((corner) => (
        <div
          className={cn(
            "target-cursor-corner absolute top-1/2 left-1/2 h-3 w-3 border",
            corner.className
          )}
          key={corner.className}
          style={{
            borderColor: cursorColor,
            transform: `translate(${corner.x}px, ${corner.y}px)`,
          }}
        />
      ))}
    </motion.div>
  )
}
