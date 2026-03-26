import { useEffect, useRef, useState } from 'react'

/*
  Sacred Timeline Evidence Visualization
  Inspired by the TVA monitor — a horizontal central "sacred" line
  with organic branches spreading up and down, each representing
  an evidence file (photography/video/design work).
*/

const EVIDENCE_ITEMS = [
    { id: 'EV-001', title: 'Temporal Distortion Series', category: 'PHOTOGRAPHY', side: 'top', x: 12 },
    { id: 'EV-002', title: 'Sacred Timeline — Motion', category: 'VIDEO EDIT', side: 'bottom', x: 22 },
    { id: 'EV-003', title: 'Variant Portraits', category: 'PHOTOGRAPHY', side: 'top', x: 35 },
    { id: 'EV-004', title: 'Nexus Brand Identity', category: 'DESIGN', side: 'bottom', x: 48 },
    { id: 'EV-005', title: 'Multiverse Transitions', category: 'VIDEO EDIT', side: 'top', x: 62 },
    { id: 'EV-006', title: 'Chrono Landscapes', category: 'PHOTOGRAPHY', side: 'bottom', x: 75 },
]

const CATEGORY_CONFIG = {
    'PHOTOGRAPHY': { color: '#e8720c', label: 'PHOTO' },
    'VIDEO EDIT': { color: '#d4a843', label: 'VIDEO' },
    'DESIGN': { color: '#33cc33', label: 'DESIGN' },
}

export default function Gallery() {
    const sectionRef = useRef(null)
    const [activeFilter, setActiveFilter] = useState('ALL')
    const [hoveredId, setHoveredId] = useState(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible')
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    const filters = ['ALL', 'PHOTOGRAPHY', 'VIDEO EDIT', 'DESIGN']
    const filtered = activeFilter === 'ALL'
        ? EVIDENCE_ITEMS
        : EVIDENCE_ITEMS.filter(item => item.category === activeFilter)

    return (
        <section id="gallery" className="section gallery-section" ref={sectionRef}>
            <div className="section-header">TVA EVIDENCE ARCHIVE</div>
            <h2 className="section-title">EVIDENCE FILES</h2>

            <div className="gallery-filters">
                {filters.map(f => (
                    <button
                        key={f}
                        className={`filter-btn ${activeFilter === f ? 'filter-active' : ''}`}
                        onClick={() => setActiveFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Sacred Timeline Visualization */}
            <div className="sacred-timeline-container">
                {/* The main horizontal timeline */}
                <div className={`sacred-timeline ${isVisible ? 'st-visible' : ''}`}>
                    {/* Central sacred line — red/orange gradient */}
                    <div className="st-main-line">
                        <div className="st-line-glow" />
                        <div className="st-line-pulse" />
                    </div>

                    {/* Branch lines spreading from center */}
                    {filtered.map((item, i) => {
                        const config = CATEGORY_CONFIG[item.category]
                        const isHovered = hoveredId === item.id
                        const isTop = item.side === 'top'

                        return (
                            <div
                                key={item.id}
                                className={`st-branch ${isTop ? 'st-branch-top' : 'st-branch-bottom'} ${isVisible ? 'st-branch-visible' : ''} ${isHovered ? 'st-branch-hovered' : ''}`}
                                style={{
                                    left: `${item.x}%`,
                                    transitionDelay: `${0.3 + i * 0.15}s`,
                                    '--branch-color': config.color,
                                }}
                                onMouseEnter={() => setHoveredId(item.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                {/* Branch line (organic curve) */}
                                <svg className="st-branch-svg" viewBox="0 0 60 80" preserveAspectRatio="none">
                                    <path
                                        d={isTop
                                            ? `M 30 80 Q ${25 + (i % 3) * 5} 50, ${20 + (i % 4) * 8} 0`
                                            : `M 30 0 Q ${25 + (i % 3) * 5} 30, ${20 + (i % 4) * 8} 80`
                                        }
                                        fill="none"
                                        stroke={config.color}
                                        strokeWidth="2"
                                        opacity={isHovered ? '0.9' : '0.5'}
                                        className="st-branch-path"
                                    />
                                </svg>

                                {/* Node dot at branch tip */}
                                <div className="st-node" style={{
                                    background: isHovered ? config.color : 'transparent',
                                    borderColor: config.color,
                                    boxShadow: isHovered ? `0 0 10px ${config.color}` : 'none',
                                }} />

                                {/* Evidence label */}
                                <div className={`st-label ${isHovered ? 'st-label-visible' : ''}`}>
                                    <span className="st-label-id" style={{ color: config.color }}>{item.id}</span>
                                    <span className="st-label-title">{item.title}</span>
                                    <span className="st-label-cat" style={{ color: config.color, borderColor: config.color }}>
                                        {config.label}
                                    </span>
                                </div>
                            </div>
                        )
                    })}

                    {/* Smaller decorative branches */}
                    {[8, 18, 28, 42, 55, 68, 82, 90].map((x, i) => (
                        <div
                            key={`deco-${i}`}
                            className={`st-deco-branch ${i % 2 === 0 ? 'st-deco-top' : 'st-deco-bottom'} ${isVisible ? 'st-deco-visible' : ''}`}
                            style={{ left: `${x}%`, transitionDelay: `${0.2 + i * 0.08}s` }}
                        >
                            <svg viewBox="0 0 20 40" preserveAspectRatio="none">
                                <path
                                    d={i % 2 === 0
                                        ? `M 10 40 Q ${8 + (i % 3) * 3} 25, ${6 + (i % 4) * 4} 0`
                                        : `M 10 0 Q ${8 + (i % 3) * 3} 15, ${6 + (i % 4) * 4} 40`
                                    }
                                    fill="none"
                                    stroke="rgba(232, 114, 12, 0.25)"
                                    strokeWidth="1.5"
                                />
                            </svg>
                        </div>
                    ))}

                    {/* Origin and end markers */}
                    <div className="st-origin">
                        <div className="st-origin-dot" />
                    </div>
                    <div className="st-end">
                        <div className="st-end-dot" />
                    </div>
                </div>

                {/* Legend */}
                <div className="st-legend">
                    {Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => (
                        <div key={cat} className="st-legend-item">
                            <span className="st-legend-dot" style={{ background: cfg.color }} />
                            <span className="st-legend-label dim-text">{cat}</span>
                        </div>
                    ))}
                    <span className="st-legend-note dim-text">HOVER BRANCHES TO VIEW FILES</span>
                </div>
            </div>
        </section>
    )
}
