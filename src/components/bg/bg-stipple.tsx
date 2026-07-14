import { useEffect, useRef } from "react"

const GRID_STEP = 11
const DOT_RADIUS = 2
const MASK_INNER = 0.0
const MASK_OUTER = 0.4
const APPEAR_MS = 700
const APPEAR_STAGGER_MS = 1100
const TWINKLE_FLOOR = 0.4

type Dot = {
  x: number
  y: number
  mask: number
  phase: number
  speed: number
  delay: number
}

/**
 * Full-viewport dot field for presentation backgrounds. Shares the brand
 * stipple aesthetic with the home hero, but fades toward the center so a
 * centered logo stays legible, and spaces dots wider to stay cheap at full
 * screen. Honors prefers-reduced-motion by rendering a static field.
 */
function BgStipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      return
    }

    const reduceMedia = window.matchMedia("(prefers-reduced-motion: reduce)")

    let dots: Dot[] = []
    let sprite: HTMLCanvasElement | null = null
    let spriteOffset = 0
    let maxAlpha = 0.32
    let dpr = 1
    let raf = 0
    let start = performance.now()

    const readTheme = () => {
      const styles = getComputedStyle(canvas)
      const color = styles.color || "rgb(167, 139, 250)"
      const opacity = Number.parseFloat(
        styles.getPropertyValue("--stipple-opacity")
      )
      maxAlpha = Number.isFinite(opacity) ? opacity : 0.32

      const size = Math.ceil((DOT_RADIUS + 1) * 2 * dpr)
      const spriteCanvas = document.createElement("canvas")
      spriteCanvas.width = size
      spriteCanvas.height = size
      const spriteCtx = spriteCanvas.getContext("2d")
      if (spriteCtx) {
        spriteCtx.fillStyle = color
        spriteCtx.beginPath()
        spriteCtx.arc(size / 2, size / 2, DOT_RADIUS * dpr, 0, Math.PI * 2)
        spriteCtx.fill()
      }
      sprite = spriteCanvas
      spriteOffset = size / 2
    }

    const build = () => {
      dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.round(rect.width * dpr))
      canvas.height = Math.max(1, Math.round(rect.height * dpr))

      readTheme()

      dots = []
      const width = rect.width
      const height = rect.height
      if (width === 0 || height === 0) {
        return
      }

      const halfW = width / 2
      const halfH = height / 2

      for (let y = 0; y <= height; y += GRID_STEP) {
        for (let x = 0; x <= width; x += GRID_STEP) {
          const nx = (x - halfW) / halfW
          const ny = (y - halfH) / halfH
          const radius = Math.hypot(nx, ny)
          const linear = Math.min(
            1,
            Math.max(0, (radius - MASK_INNER) / (MASK_OUTER - MASK_INNER))
          )
          // Ease so the center stays dim and opacity ramps up toward the edges.
          const mask = linear * linear
          if (mask <= 0) {
            continue
          }
          dots.push({
            x: x * dpr,
            y: y * dpr,
            mask,
            phase: Math.random() * Math.PI * 2,
            speed: 0.6 + Math.random() * 1.4,
            delay: Math.random() * APPEAR_STAGGER_MS,
          })
        }
      }
    }

    const drawStatic = () => {
      if (!sprite) {
        return
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const dot of dots) {
        ctx.globalAlpha = maxAlpha * dot.mask
        ctx.drawImage(sprite, dot.x - spriteOffset, dot.y - spriteOffset)
      }
      ctx.globalAlpha = 1
    }

    const frame = (now: number) => {
      if (!sprite) {
        return
      }
      const elapsed = now - start
      const seconds = elapsed / 1000
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const dot of dots) {
        const appear = Math.min(1, Math.max(0, (elapsed - dot.delay) / APPEAR_MS))
        if (appear <= 0) {
          continue
        }
        const twinkle =
          TWINKLE_FLOOR +
          (1 - TWINKLE_FLOOR) *
            (0.5 + 0.5 * Math.sin(seconds * dot.speed + dot.phase))
        ctx.globalAlpha = maxAlpha * dot.mask * appear * twinkle
        ctx.drawImage(sprite, dot.x - spriteOffset, dot.y - spriteOffset)
      }
      ctx.globalAlpha = 1
      raf = window.requestAnimationFrame(frame)
    }

    const run = () => {
      window.cancelAnimationFrame(raf)
      if (reduceMedia.matches) {
        drawStatic()
        return
      }
      start = performance.now()
      raf = window.requestAnimationFrame(frame)
    }

    build()
    run()

    const resizeObserver = new ResizeObserver(() => {
      build()
      run()
    })
    resizeObserver.observe(canvas)

    const themeObserver = new MutationObserver(() => {
      readTheme()
      if (reduceMedia.matches) {
        drawStatic()
      }
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    const onReduceChange = () => run()
    reduceMedia.addEventListener("change", onReduceChange)

    return () => {
      window.cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      reduceMedia.removeEventListener("change", onReduceChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="bg-stipple-canvas pointer-events-none absolute inset-0 size-full"
    />
  )
}

export { BgStipple }
