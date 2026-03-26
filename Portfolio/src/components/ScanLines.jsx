import { useState, useEffect } from 'react'

export default function ScanLines() {
    const [glitch, setGlitch] = useState(false)

    useEffect(() => {
        // Random glitch effect every 8-15 seconds
        const interval = setInterval(() => {
            setGlitch(true)
            setTimeout(() => setGlitch(false), 150)
        }, 8000 + Math.random() * 7000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="scanlines-overlay" aria-hidden="true">
            <div className="scanline-bar" />
            <div className="vignette" />
            {glitch && <div className="glitch-bar" />}
        </div>
    )
}
