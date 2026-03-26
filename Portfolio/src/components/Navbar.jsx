import { useState, useEffect } from 'react'

const NAV_ITEMS = [
    { id: 'about', label: 'CASE FILE' },
    { id: 'skills', label: 'ANALYSIS' },
    { id: 'projects', label: 'NEXUS EVENTS' },
    { id: 'gallery', label: 'EVIDENCE' },
    { id: 'contact', label: 'COMMS' },
]

// ── Whole-name Loki variants for navbar infinite loop ──
const LOGO_VARIANTS = [
    'ASHUTOSH',
    'АШУТОШ',
    'アシュトシュ',
    'ଆଶୁତୋଷ',
    '아슈토쉬',
    'आशुतोष',
    'ÅŠHÙTØSH',
    'ΛΣΗUTΘΣ',
    'ఆశుతోష్',
    '阿修陀什',
    'อชุโตช',
    'ASHUTOSH', // repeat latin for longer display
]

export default function Navbar({ playAudio }) {
    const [active, setActive] = useState('')
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [logoText, setLogoText] = useState('ASHUTOSH')

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)

            const sections = NAV_ITEMS.map(item => document.getElementById(item.id))
            for (let i = sections.length - 1; i >= 0; i--) {
                if (sections[i]) {
                    const rect = sections[i].getBoundingClientRect()
                    if (rect.top <= 150) {
                        setActive(NAV_ITEMS[i].id)
                        break
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // ── Infinite whole-name Loki cycling in navbar ──
    useEffect(() => {
        let timeout
        const cycle = () => {
            setLogoText(prev => {
                let next
                do {
                    next = LOGO_VARIANTS[Math.floor(Math.random() * LOGO_VARIANTS.length)]
                } while (next === prev)
                return next
            })
            timeout = setTimeout(cycle, 180 + Math.random() * 120)
        }
        cycle()
        return () => clearTimeout(timeout)
    }, [])

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        setMenuOpen(false)
    }

    return (
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-inner">
                <div
                    className="navbar-logo"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    onDoubleClick={() => playAudio?.('theme')}
                    title="Double-click for TVA Theme"
                >
                    <span className="logo-tva">TVA</span>
                    <span className="logo-divider">|</span>
                    <span className="logo-name logo-loki-anim" key={logoText}>
                        {logoText}
                    </span>
                </div>

                <button
                    className={`navbar-toggle ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    <span /><span /><span />
                </button>

                <ul className={`navbar-links ${menuOpen ? 'navbar-links-open' : ''}`}>
                    {NAV_ITEMS.map(item => (
                        <li key={item.id}>
                            <button
                                className={`nav-link ${active === item.id ? 'nav-link-active' : ''}`}
                                onClick={() => scrollTo(item.id)}
                            >
                                <span className="nav-prefix">&gt;</span>
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}
