import { useState, useEffect, useRef, useCallback } from 'react'

/*
  HYBRID LOKI ANIMATION — HERO
  ─────────────────────────────
  Each character of "ASHUTOSH MAHARANA" independently cycles through
  different scripts/fonts with glitch effects for ~4 seconds,
  then all characters settle to the final static name.
*/

// Character-level variant pools — each char picks randomly from these
const CHAR_VARIANTS = {
    A: ['A', 'Α', 'А', 'ア', 'ଆ', '아', 'आ', 'Å', 'ఆ', 'Ⲁ', 'Λ', 'Ä'],
    S: ['S', 'Σ', 'С', 'シ', 'ଶ', '슈', 'श', 'Š', 'శ', 'Ⲥ', 'Ş', '$'],
    H: ['H', 'Η', 'Н', 'ハ', 'ହ', '하', 'ह', 'Ħ', 'హ', 'Ⲏ', 'Ḧ', '#'],
    U: ['U', 'Υ', 'У', 'ウ', 'ଉ', '우', 'उ', 'Ù', 'ఉ', 'Ü', 'Ū', 'Ǘ'],
    T: ['T', 'Τ', 'Т', 'ト', 'ତ', '토', 'त', 'Ŧ', 'త', 'Ⲧ', 'Ť', '†'],
    O: ['O', 'Ω', 'О', 'オ', 'ଓ', '오', 'ओ', 'Ø', 'ఓ', 'Ⲟ', 'Θ', '0'],
    M: ['M', 'Μ', 'М', 'マ', 'ମ', '마', 'म', 'Ṁ', 'మ', 'Ⲙ', 'Ṃ', 'Ɯ'],
    R: ['R', 'Ρ', 'Р', 'ラ', 'ର', '라', 'र', 'Ř', 'ర', 'Ɍ', 'Ŗ', '®'],
    N: ['N', 'Ν', 'Н', 'ナ', 'ନ', '나', 'न', 'Ñ', 'న', 'Ⲛ', 'Ň', 'И'],
    ' ': [' '],
}

const FINAL_NAME = 'ASHUTOSH MAHARANA'

// Random font for each character each frame
const FONTS = [
    'Georgia, serif',
    '"Times New Roman", serif',
    '"Courier New", monospace',
    'Impact, sans-serif',
    'Arial Black, sans-serif',
    'serif',
    'sans-serif',
    '"Lucida Console", monospace',
]

const SUBTITLE_LINES = [
    'SOFTWARE ENGINEER // CYBERSECURITY SPECIALIST',
    'DESIGNER • VIDEO EDITOR • PHOTOGRAPHER',
]

const LOKI_QUOTES = [
    '"I am burdened with glorious purpose."',
    '"We write our own destiny now."',
    '"What makes a Loki a Loki is that we survive."',
    '"I know what kind of god I need to be — for you. For all of us."',
]

export default function Hero({ playAudio }) {
    const [phase, setPhase] = useState('cycling') // cycling | settling | done
    const [charStates, setCharStates] = useState(
        FINAL_NAME.split('').map(ch => ({
            char: ch,
            font: 'monospace',
            settled: ch === ' ',
        }))
    )
    const [subtitleIndex, setSubtitleIndex] = useState(-1)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [lokiQuote, setLokiQuote] = useState(0)
    const heroRef = useRef(null)

    // Phase 1: Full cycling (0-2.5s) — all characters randomize fast
    useEffect(() => {
        if (phase !== 'cycling') return
        const interval = setInterval(() => {
            setCharStates(prev =>
                prev.map(cs => {
                    if (cs.settled) return cs
                    const pool = CHAR_VARIANTS[cs.char] || [cs.char]
                    return {
                        ...cs,
                        char: pool[Math.floor(Math.random() * pool.length)],
                        font: FONTS[Math.floor(Math.random() * FONTS.length)],
                    }
                })
            )
        }, 160)

        // Move to settling phase after 2.5s
        const timer = setTimeout(() => {
            clearInterval(interval)
            setPhase('settling')
        }, 4500)

        return () => { clearInterval(interval); clearTimeout(timer) }
    }, [phase])

    // Phase 2: Settling (2.5s-4s) — characters settle one by one
    useEffect(() => {
        if (phase !== 'settling') return

        const finalChars = FINAL_NAME.split('')
        // Settle from outside in for dramatic effect
        const settleOrder = []
        let left = 0, right = finalChars.length - 1
        while (left <= right) {
            settleOrder.push(left)
            if (left !== right) settleOrder.push(right)
            left++; right--
        }

        // Still cycle unsettled chars
        const cycleInterval = setInterval(() => {
            setCharStates(prev =>
                prev.map((cs, i) => {
                    if (cs.settled) return cs
                    const origChar = finalChars[i]
                    const pool = CHAR_VARIANTS[origChar] || [origChar]
                    return {
                        ...cs,
                        char: pool[Math.floor(Math.random() * pool.length)],
                        font: FONTS[Math.floor(Math.random() * FONTS.length)],
                    }
                })
            )
        }, 140)

        // Settle characters one by one
        settleOrder.forEach((idx, i) => {
            setTimeout(() => {
                setCharStates(prev => prev.map((cs, j) =>
                    j === idx ? { char: finalChars[idx], font: 'inherit', settled: true } : cs
                ))
            }, i * 120)
        })

        // All done
        const doneTimer = setTimeout(() => {
            clearInterval(cycleInterval)
            setPhase('done')
            setCharStates(finalChars.map(ch => ({ char: ch, font: 'inherit', settled: true })))
        }, settleOrder.length * 120 + 300)

        return () => { clearInterval(cycleInterval); clearTimeout(doneTimer) }
    }, [phase])

    // Subtitles appear after settling
    useEffect(() => {
        if (phase === 'done') {
            setTimeout(() => setSubtitleIndex(0), 300)
            setTimeout(() => setSubtitleIndex(1), 800)
        }
    }, [phase])

    // Rotating quotes
    useEffect(() => {
        const qi = setInterval(() => setLokiQuote(prev => (prev + 1) % LOKI_QUOTES.length), 5000)
        return () => clearInterval(qi)
    }, [])

    const handleMouseMove = useCallback((e) => {
        if (!heroRef.current) return
        const rect = heroRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
        setMousePos({ x, y })
    }, [])

    return (
        <section className="hero" ref={heroRef} onMouseMove={handleMouseMove}>
            <div className="hero-content" style={{
                transform: `translate(${mousePos.x * -5}px, ${mousePos.y * -5}px)`,
                transition: 'transform 0.15s ease-out',
            }}>
                <div className="hero-classification">
                    <span className="classification-dot" />
                    <span>VARIANT CLASSIFICATION: ACTIVE</span>
                </div>

                {/* ── PER-CHARACTER LOKI NAME ── */}
                <div className="loki-title-container">
                    <h1 className={`loki-title ${phase === 'done' ? 'loki-settled' : ''}`}>
                        {charStates.map((cs, i) => (
                            <span
                                key={i}
                                className={`loki-char ${cs.settled ? 'loki-char-settled' : 'loki-char-cycling'}`}
                                style={{
                                    fontFamily: cs.font,
                                    animationDelay: `${i * 0.02}s`,
                                }}
                            >
                                {cs.char}
                            </span>
                        ))}
                    </h1>

                    {/* Glitch scan lines during cycling */}
                    {phase !== 'done' && (
                        <div className="loki-glitch-layer" aria-hidden="true">
                            <div className="loki-glitch-r" />
                            <div className="loki-glitch-g" />
                            <div className="loki-glitch-b" />
                        </div>
                    )}
                </div>

                <div className="hero-subtitles">
                    {SUBTITLE_LINES.map((line, i) => (
                        <p key={i} className={`hero-subtitle ${i <= subtitleIndex ? 'hero-subtitle-visible' : ''}`}>
                            {line}
                        </p>
                    ))}
                </div>

                <div
                    className="hero-loki-quote"
                    onClick={() => playAudio?.('glorious')}
                    title="Click for Glorious Purpose"
                    style={{ cursor: 'pointer' }}
                >
                    <span className="loki-quote-mark">❝</span>
                    <span className="loki-quote-text" key={lokiQuote}>{LOKI_QUOTES[lokiQuote]}</span>
                </div>

                <div className="hero-status">
                    <div className="status-item">
                        <span className="status-label">TIMELINE</span>
                        <span className="status-value">SACRED</span>
                    </div>
                    <div className="status-divider" />
                    <div className="status-item">
                        <span className="status-label">BRANCH</span>
                        <span className="status-value">#616</span>
                    </div>
                    <div className="status-divider" />
                    <div className="status-item">
                        <span className="status-label">CLEARANCE</span>
                        <span className="status-value status-active">LEVEL 7</span>
                    </div>
                    <div className="status-divider" />
                    <div className="status-item">
                        <span className="status-label">MULTIVERSE</span>
                        <span className="status-value">INTACT</span>
                    </div>
                </div>

                <div className="hero-scroll-hint">
                    <span>▾ SCROLL TO ACCESS FILE ▾</span>
                </div>
            </div>

            <div className="hero-particles" aria-hidden="true" style={{
                transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`,
                transition: 'transform 0.3s ease-out',
            }}>
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="hero-particle" style={{
                        left: `${10 + (i * 7.5) % 90}%`,
                        top: `${15 + ((i * 13 + 7) % 70)}%`,
                        animationDelay: `${i * 0.4}s`,
                        animationDuration: `${3 + (i % 3)}s`,
                    }} />
                ))}
            </div>

            <div className="hero-grid" aria-hidden="true" style={{
                backgroundPosition: `${50 + mousePos.x * 10}% ${50 + mousePos.y * 10}%`,
            }} />

            <div className="hero-mouse-glow" style={{
                background: `radial-gradient(600px circle at ${50 + mousePos.x * 50}% ${50 + mousePos.y * 50}%, rgba(232, 114, 12, 0.04), transparent 60%)`,
            }} />
        </section>
    )
}
