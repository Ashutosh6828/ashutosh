import { useEffect, useRef, useState } from 'react'

export default function About() {
    const sectionRef = useRef(null)
    const [hoveredField, setHoverField] = useState(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible')
                }
            },
            { threshold: 0.1 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    const fields = [
        { key: 'designation', label: 'DESIGNATION', value: 'Software Engineer', icon: '⚙' },
        { key: 'spec', label: 'SPECIALIZATION', value: 'Cybersecurity', icon: '🔒', highlight: true },
        { key: 'origin', label: 'BRANCH ORIGIN', value: 'Timeline #616', icon: '🌀' },
        { key: 'threat', label: 'THREAT LEVEL', value: 'Minimal (Recruited)', icon: '◈' },
        { key: 'handler', label: 'TVA HANDLER', value: 'Agent Mobius M. Mobius', icon: '👤' },
        { key: 'nexus', label: 'NEXUS SIGNATURE', value: 'Glorious Purpose', icon: '✦', highlight: true },
    ]

    return (
        <section id="about" className="section about-section" ref={sectionRef}>
            <div className="section-header">TVA PERSONNEL DATABASE</div>
            <h2 className="section-title">CASE FILE</h2>

            <div className="case-file">
                {/* Top border accent */}
                <div className="cf-top-bar" />

                {/* Header row */}
                <div className="cf-header">
                    <div className="cf-header-id">
                        <span className="cf-logo">TVA</span>
                        <div className="cf-file-info">
                            <span className="cf-file-number dim-text">FILE NO. TVA-2024-AM616</span>
                            <span className="cf-file-type dim-text">VARIANT PERSONNEL FILE</span>
                        </div>
                    </div>
                    <span className="cf-classified">CLASSIFIED</span>
                </div>

                <div className="cf-divider" />

                {/* Name & Status */}
                <div className="cf-identity">
                    <h3 className="cf-name">ASHUTOSH MAHARANA</h3>
                    <div className="cf-badges">
                        <span className="cf-badge cf-badge-active">◉ ACTIVE VARIANT</span>
                        <span className="cf-badge cf-badge-level">LVL 7 CLEARANCE</span>
                    </div>
                </div>

                <div className="cf-divider" />

                {/* Data fields grid */}
                <div className="cf-fields">
                    {fields.map(f => (
                        <div
                            key={f.key}
                            className={`cf-field ${hoveredField === f.key ? 'cf-field-active' : ''}`}
                            onMouseEnter={() => setHoverField(f.key)}
                            onMouseLeave={() => setHoverField(null)}
                        >
                            <span className="cf-field-icon">{f.icon}</span>
                            <div className="cf-field-data">
                                <span className="cf-field-label">{f.label}</span>
                                <span className={`cf-field-value ${f.highlight ? 'orange-text' : ''}`}>{f.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cf-divider" />

                {/* Expertise row */}
                <div className="cf-expertise">
                    <span className="cf-section-label dim-text">▸ MULTI-TIMELINE EXPERTISE</span>
                    <div className="cf-tags">
                        {[
                            { icon: '🎨', name: 'Designer' },
                            { icon: '🎬', name: 'Video Editor' },
                            { icon: '📸', name: 'Photographer' },
                            { icon: '🛡️', name: 'Cyber Guardian' },
                        ].map(t => (
                            <span key={t.name} className="cf-tag">{t.icon} {t.name}</span>
                        ))}
                    </div>
                </div>

                <div className="cf-divider" />

                {/* Analyst notes */}
                <div className="cf-notes">
                    <div className="cf-notes-header">
                        <span className="cf-section-label dim-text">▸ ANALYST REPORT</span>
                        <span className="dim-text">AGENT: MOBIUS M. MOBIUS</span>
                    </div>
                    <p className="cf-notes-body">
                        Multi-disciplinary variant operating across creative and technical timelines.
                        Primary expertise in fortifying digital infrastructures against temporal anomalies
                        (cybersecurity). Secondary branches extend into visual design, motion media,
                        and photographic documentation. Cleared for all TVA operations.
                    </p>
                    <div className="cf-addendum">
                        <span className="cf-addendum-label">ADDENDUM</span>
                        <p>
                            Displays Loki-class determination — refuses to follow the Sacred Timeline when
                            a better path exists. With Doctor Doom threatening the multiverse, this variant's
                            cybersecurity expertise is flagged as critical-tier. <span className="dim-text">— M.M.</span>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="cf-footer">
                    <span className="dim-text">FILED: JUDGE RAVONNA RENSLAYER</span>
                    <span className="dim-text">POST-DOOM ERA • FOR ALL TIME. ALWAYS.</span>
                </div>
            </div>
        </section>
    )
}
