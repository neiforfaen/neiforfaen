"use client"

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type { ReactNode } from "react"

const SQUARE = 14
const PAD = 6
const MORPH_GRACE = 500
const EXIT_GRACE = 100

interface CursorContextValue {
  onEnter: (el: HTMLElement) => void
  onLeave: () => void
  onExitZone: () => void
}

const CursorContext = createContext<CursorContextValue>({
  onEnter: () => {
    // no-op until a provider mounts
  },
  onExitZone: () => {
    // no-op until a provider mounts
  },
  onLeave: () => {
    // no-op until a provider mounts
  },
})

export const useCursor = () => useContext(CursorContext)

export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const reduceMotion = useReducedMotion()

  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)
  const mw = useMotionValue(SQUARE)
  const mh = useMotionValue(SQUARE)

  const spring = { damping: 45, mass: 0.5, stiffness: 600 }
  const sx = useSpring(mx, spring)
  const sy = useSpring(my, spring)
  const sw = useSpring(mw, spring)
  const sh = useSpring(mh, spring)

  const posX = reduceMotion ? mx : sx
  const posY = reduceMotion ? my : sy
  const boxW = reduceMotion ? mw : sw
  const boxH = reduceMotion ? mh : sh

  const enabledRef = useRef(false)
  const activeEl = useRef<HTMLElement | null>(null)
  const lastPointer = useRef({ x: -100, y: -100 })
  const revealed = useRef(false)
  const leaveTimer = useRef<number | null>(null)

  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  const frameToEl = useCallback(
    (el: HTMLElement) => {
      const r = el.getBoundingClientRect()
      mx.set(r.left - PAD)
      my.set(r.top - PAD)
      mw.set(r.width + PAD * 2)
      mh.set(r.height + PAD * 2)
    },
    [mx, my, mw, mh]
  )

  const collapse = useCallback(() => {
    activeEl.current = null
    setHovering(false)
    const { x, y } = lastPointer.current
    mx.set(x - SQUARE / 2)
    my.set(y - SQUARE / 2)
    mw.set(SQUARE)
    mh.set(SQUARE)
  }, [mx, my, mw, mh])

  const scheduleCollapse = useCallback(
    (delay: number) => {
      if (leaveTimer.current !== null) {
        clearTimeout(leaveTimer.current)
      }
      leaveTimer.current = window.setTimeout(() => {
        leaveTimer.current = null
        collapse()
      }, delay)
    },
    [collapse]
  )

  const onEnter = useCallback(
    (el: HTMLElement) => {
      if (!enabledRef.current) {
        return
      }
      if (leaveTimer.current !== null) {
        clearTimeout(leaveTimer.current)
        leaveTimer.current = null
      }
      activeEl.current = el
      setHovering(true)
      frameToEl(el)
    },
    [frameToEl]
  )

  const onLeave = useCallback(() => {
    if (!enabledRef.current) {
      return
    }
    scheduleCollapse(MORPH_GRACE)
  }, [scheduleCollapse])

  // Leaving the whole list: collapse back to the square almost immediately.
  const onExitZone = useCallback(() => {
    if (!enabledRef.current) {
      return
    }
    scheduleCollapse(EXIT_GRACE)
  }, [scheduleCollapse])

  useEffect(
    () => () => {
      if (leaveTimer.current !== null) {
        clearTimeout(leaveTimer.current)
      }
    },
    []
  )

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (!enabled) {
      return
    }
    const root = document.documentElement
    root.classList.add("cursor-none")
    return () => root.classList.remove("cursor-none")
  }, [enabled])

  useEffect(() => {
    if (!enabled) {
      return
    }
    const onMove = (e: PointerEvent) => {
      lastPointer.current = { x: e.clientX, y: e.clientY }
      if (!revealed.current) {
        revealed.current = true
        setVisible(true)
      }
      if (activeEl.current) {
        return
      }
      mx.set(e.clientX - SQUARE / 2)
      my.set(e.clientY - SQUARE / 2)
    }
    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [enabled, mx, my])

  useEffect(() => {
    if (!enabled) {
      return
    }
    const sync = () => {
      if (activeEl.current) {
        frameToEl(activeEl.current)
      }
    }
    window.addEventListener("scroll", sync, true)
    window.addEventListener("resize", sync)
    return () => {
      window.removeEventListener("scroll", sync, true)
      window.removeEventListener("resize", sync)
    }
  }, [enabled, frameToEl])

  const value = useMemo(
    () => ({ onEnter, onExitZone, onLeave }),
    [onEnter, onExitZone, onLeave]
  )

  const colorTween = reduceMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: "easeOut" as const }

  return (
    <CursorContext.Provider value={value}>
      {children}
      {enabled ? (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-50 box-border border-solid"
          style={{
            height: boxH,
            opacity: visible ? 1 : 0,
            width: boxW,
            x: posX,
            y: posY,
          }}
          animate={hovering ? "project" : "idle"}
          variants={{
            idle: {
              borderColor: "var(--foreground)",
              borderWidth: 1.25,
              zIndex: 9999,
            },
            project: {
              backgroundColor: "rgba(127,127,127,0)",
              borderColor: "var(--foreground)",
              borderWidth: 1,
            },
          }}
          transition={{
            backgroundColor: colorTween,
            borderColor: colorTween,
            borderRadius: reduceMotion
              ? { duration: 0 }
              : { type: "spring", ...spring },
            borderWidth: colorTween,
          }}
        />
      ) : null}
    </CursorContext.Provider>
  )
}
