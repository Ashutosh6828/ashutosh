import { useEffect, useRef, useCallback } from 'react'

/**
 * ParticleCanvas — TVA Particle Neural Network Background
 * Inspired by decoder.shiprocket.in's constellation/particle-network effect.
 *
 * Features:
 *  - Canvas-based high-performance rendering
 *  - Multi-layer depth: background (slow, dim) + foreground (faster, bright)
 *  - Dynamic connecting lines between nearby nodes
 *  - Mouse tracking: particles gently repel/attract cursor
 *  - DOOM mode: switches to toxic-green palette
 *  - Responsive: redraws on resize
 */
export default function ParticleCanvas({ isDoomMode }) {
  const canvasRef = useRef(null)
  const animFrameRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const isDoomRef = useRef(isDoomMode)

  // Keep doom ref in sync without triggering full re-init
  useEffect(() => {
    isDoomRef.current = isDoomMode
  }, [isDoomMode])

  const initParticles = useCallback((W, H) => {
    const particles = []
    // Two layers: bg (index 0-49) and fg (index 50-99)
    const TOTAL = 100

    for (let i = 0; i < TOTAL; i++) {
      const isBg = i < 50
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * (isBg ? 0.22 : 0.42),
        vy: (Math.random() - 0.5) * (isBg ? 0.22 : 0.42),
        radius: isBg ? Math.random() * 1.5 + 0.6 : Math.random() * 2.2 + 1,
        alpha: isBg ? Math.random() * 0.45 + 0.15 : Math.random() * 0.65 + 0.3,
        layer: isBg ? 0 : 1,       // 0 = background, 1 = foreground
        baseAlpha: isBg ? Math.random() * 0.45 + 0.15 : Math.random() * 0.65 + 0.3,
      })
    }
    particlesRef.current = particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles(canvas.width, canvas.height)
    }

    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    const MAX_DIST_BG = 130   // bg-layer connection radius
    const MAX_DIST_FG = 160   // fg-layer connection radius
    const MOUSE_RADIUS = 120  // repulsion radius
    const REPEL_STRENGTH = 0.3

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      const doom = isDoomRef.current

      // TVA orange palette vs DOOM green palette
      const primaryColor = doom ? '0, 255, 68' : '232, 114, 12'      // orange / neon-green
      const secondaryColor = doom ? '85, 255, 0' : '212, 168, 67'    // amber / lime
      const bgWarm = doom ? '0, 20, 5' : '15, 8, 2'                  // bg fill tint

      // Fill canvas with deep dark background each frame
      ctx.fillStyle = `rgb(${bgWarm})`
      ctx.fillRect(0, 0, W, H)

      const mouse = mouseRef.current
      const particles = particlesRef.current

      // Update particle positions
      for (const p of particles) {
        // Mouse repulsion
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * REPEL_STRENGTH
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }

        // Apply velocity with damping
        p.vx *= 0.99
        p.vy *= 0.99

        // Clamp max speed to prevent runaway
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        const maxSpeed = p.layer === 0 ? 0.4 : 0.7
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed
          p.vy = (p.vy / speed) * maxSpeed
        }

        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < -10) p.x = W + 10
        if (p.x > W + 10) p.x = -10
        if (p.y < -10) p.y = H + 10
        if (p.y > H + 10) p.y = -10

        // Gentle alpha pulse
        p.alpha = p.baseAlpha + Math.sin(Date.now() * 0.001 + p.x * 0.01) * 0.08
      }

      // Draw connecting lines — background layer first (z-order)
      const bgParticles = particles.filter(p => p.layer === 0)
      const fgParticles = particles.filter(p => p.layer === 1)

      const drawConnections = (group, maxDist, colorRgb, maxAlpha) => {
        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {
            const a = group[i], b = group[j]
            const dx = a.x - b.x
            const dy = a.y - b.y
            const d = Math.sqrt(dx * dx + dy * dy)
            if (d < maxDist) {
              const lineAlpha = (1 - d / maxDist) * maxAlpha
              ctx.beginPath()
              ctx.strokeStyle = `rgba(${colorRgb}, ${lineAlpha})`
              ctx.lineWidth = 0.6
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.stroke()
            }
          }
        }
      }

      drawConnections(bgParticles, MAX_DIST_BG, primaryColor, 0.22)
      drawConnections(fgParticles, MAX_DIST_FG, primaryColor, 0.42)

      // Cross-layer connections (subtler)
      for (const bg of bgParticles) {
        for (const fg of fgParticles) {
          const dx = bg.x - fg.x
          const dy = bg.y - fg.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 100) {
            const lineAlpha = (1 - d / 100) * 0.1
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${secondaryColor}, ${lineAlpha})`
            ctx.lineWidth = 0.4
            ctx.moveTo(bg.x, bg.y)
            ctx.lineTo(fg.x, fg.y)
            ctx.stroke()
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        const color = p.layer === 0 ? primaryColor : primaryColor
        const glowColor = p.layer === 1 ? secondaryColor : primaryColor

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, ${p.alpha})`
        ctx.fill()

        // Glow halo on foreground particles
        if (p.layer === 1) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius + 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${glowColor}, ${p.alpha * 0.15})`
          ctx.fill()
        }
      }

      // Mouse interaction highlight — soft radial glow at cursor
      if (mouse.x > 0 && mouse.x < W) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 180)
        grad.addColorStop(0, `rgba(${primaryColor}, 0.06)`)
        grad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 180, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      animFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [initParticles])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        // CSS background is a subtle vignette — canvas JS draws the dark fill each frame
        background: 'radial-gradient(ellipse 120% 80% at 50% 0%, #100a02 0%, #08080a 55%, #050508 100%)',
        opacity: 1,
        transition: 'opacity 1s ease',
      }}
    />
  )
}
