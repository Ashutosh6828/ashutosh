import { useState, useEffect } from 'react'

const BOOT_LINES = [
    { text: '> INITIALIZING TVA...', delay: 0 },
    { text: '> TEMPORAL CORE: ONLINE', delay: 250 },
    { text: '> DOOM THREAT: ████████░░ 78%', delay: 700 },
    { text: '> NEXUS EVENT — BRANCH #616', delay: 800 },
    { text: '', delay: 1000 },
    { text: '  ██ VARIANT: ASHUTOSH MAHARANA ██', delay: 1200 },
    { text: '  ██ GLORIOUS PURPOSE: CONFIRMED ██', delay: 1200 },
    { text: '', delay: 1400 },
    { text: '> ACCESS GRANTED. WELCOME, AGENT.', delay: 1600 },
]

export default function BootSequence({ onComplete }) {
    const [visibleLines, setVisibleLines] = useState([])
    const [done, setDone] = useState(false)
    const [fadeOut, setFadeOut] = useState(false)

    useEffect(() => {
        BOOT_LINES.forEach((line) => {
            setTimeout(() => {
                setVisibleLines(prev => [...prev, line.text])
            }, line.delay)
        })

        // Total: ~2.8s content, fade at 2.2s, done at 3s
        setTimeout(() => setFadeOut(true), 2200)
        setTimeout(() => { setDone(true); onComplete() }, 3000)
    }, [onComplete])

    if (done) return null

    return (
        <div className={`boot-sequence ${fadeOut ? 'boot-fade-out' : ''}`}>
            <div className="boot-terminal">
                <div className="boot-header">
                    <span className="boot-tva-logo">TVA</span>
                    <span className="boot-header-text">TEMPORAL SYSTEM v3.14</span>
                </div>
                <div className="boot-content">
                    {visibleLines.map((line, i) => (
                        <div
                            key={i}
                            className={`boot-line ${line.includes('VARIANT:') || line.includes('██') ? 'boot-highlight' : ''
                                } ${line.includes('WELCOME') || line.includes('ACCESS') ? 'boot-success' : ''
                                } ${line.includes('GLORIOUS') ? 'boot-loki' : ''}`}
                        >
                            {line}
                        </div>
                    ))}
                    <span className="boot-cursor">█</span>
                </div>
            </div>
        </div>
    )
}
