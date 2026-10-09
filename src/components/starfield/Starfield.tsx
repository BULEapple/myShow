// 星空背景：Canvas 2D 自实现，不引入第三方库
import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface Star {
  x: number
  y: number
  r: number
  baseAlpha: number
  phase: number
  speed: number
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // 非空别名，供内部闭包使用，避免 TS 窄化在闭包中失效
    const cv = canvas
    const c2d = ctx

    let raf = 0
    let stars: Star[] = []
    // 限制 dpr，避免高分屏过度渲染
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      const { innerWidth: w, innerHeight: h } = window
      cv.width = w * dpr
      cv.height = h * dpr
      cv.style.width = `${w}px`
      cv.style.height = `${h}px`
      c2d.setTransform(dpr, 0, 0, dpr, 0, 0)

      // 粒子数动态调整，移动端降低数量保证帧率
      const count = Math.min(120, Math.floor(w / 12))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.4,
        baseAlpha: Math.random() * 0.6 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005,
      }))
    }

    function draw(time: number) {
      const { innerWidth: w, innerHeight: h } = window
      c2d.clearRect(0, 0, w, h)
      for (const s of stars) {
        // 减少动效时使用固定透明度，渲染静态星点
        const alpha = reduced
          ? s.baseAlpha
          : s.baseAlpha * (0.5 + 0.5 * Math.sin(time * s.speed + s.phase))
        c2d.beginPath()
        c2d.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        c2d.fillStyle = `rgba(230, 234, 242, ${alpha})`
        c2d.fill()
      }
    }

    function loop(time: number) {
      draw(time)
      raf = requestAnimationFrame(loop)
    }

    resize()
    if (reduced) {
      draw(0)
    } else {
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reduced])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 h-full w-full"
    />
  )
}
