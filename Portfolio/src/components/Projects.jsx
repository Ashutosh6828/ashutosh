import { useEffect, useRef, useState } from 'react'

const PROJECTS = [
    {
        id: 'NE-001',
        title: 'SmartScan Checkout',
        tag: 'NEXUS EVENT',
        description: 'Autonomous retail checkout solution with barcode scanning, real-time inventory sync, and Firebase backend. Eliminates queues across the timeline.',
        tech: ['React', 'Firebase', 'Cloud Firestore'],
        status: 'CONTAINED',
        branch: '#001',
        timeVariance: 87,
        lokiNote: 'Pruning risk: Low',
    },
    {
        id: 'NE-002',
        title: 'Cyber Sentinel',
        tag: 'TEMPORAL ANOMALY',
        description: 'Advanced threat detection system using machine learning to identify and neutralize network intrusions — protecting timelines before they branch.',
        tech: ['Python', 'TensorFlow', 'Wireshark'],
        status: 'MONITORING',
        branch: '#042',
        timeVariance: 94,
        lokiNote: 'He Who Remains flagged this',
    },
    {
        id: 'NE-003',
        title: 'PixelForge Studio',
        tag: 'BRANCH EVENT',
        description: 'Creative suite dashboard for managing design projects, video edits, and photo workflows. A single timeline for all creative operations.',
        tech: ['Next.js', 'Prisma', 'AWS S3'],
        status: 'ACTIVE',
        branch: '#099',
        timeVariance: 72,
        lokiNote: 'Variant Sylvie approved',
    },
    {
        id: 'NE-004',
        title: 'VaultGuard',
        tag: 'NEXUS EVENT',
        description: 'Zero-knowledge encrypted password vault with biometric auth and temporal key rotation. Protecting secrets across all timelines.',
        tech: ['Rust', 'WebAssembly', 'AES-256'],
        status: 'CONTAINED',
        branch: '#256',
        timeVariance: 96,
        lokiNote: 'Mobius wants one',
    },
]

export default function Projects() {
    const sectionRef = useRef(null)
    const [hoveredId, setHoveredId] = useState(null)
    const [visibleCards, setVisibleCards] = useState(new Set())

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

        // Individual card observers
        const cardObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setVisibleCards(prev => new Set([...prev, entry.target.dataset.id]))
                    }
                })
            },
            { threshold: 0.2 }
        )

        setTimeout(() => {
            document.querySelectorAll('.timeline-card').forEach(card => {
                cardObserver.observe(card)
            })
        }, 100)

        return () => { observer.disconnect(); cardObserver.disconnect() }
    }, [])

    return (
        <section id="projects" className="section projects-section" ref={sectionRef}>
            <div className="section-header">TVA TEMPORAL RECORDS</div>
            <h2 className="section-title">NEXUS EVENTS</h2>

            <div className="timeline-intro dim-text">
                &gt; The Sacred Timeline must not be broken. Each project below represents
                a significant temporal event monitored by the TVA. Hover to analyze branch data.
            </div>

            {/* Timeline */}
            <div className="timeline">
                {/* Central animated line */}
                <div className="timeline-line" aria-hidden="true">
                    <div className="timeline-line-glow" />
                    <div className="timeline-pulse" />
                </div>

                {/* Branch origin label */}
                <div className="timeline-origin">
                    <span className="timeline-origin-dot" />
                    <span className="dim-text">SACRED TIMELINE ORIGIN</span>
                </div>

                {PROJECTS.map((project, i) => (
                    <div
                        key={project.id}
                        data-id={project.id}
                        className={`timeline-card ${i % 2 === 0 ? 'timeline-left' : 'timeline-right'} ${hoveredId === project.id ? 'timeline-card-hover' : ''} ${visibleCards.has(project.id) ? 'timeline-card-visible' : ''}`}
                        onMouseEnter={() => setHoveredId(project.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        {/* Timeline node with branch line */}
                        <div className="timeline-node">
                            <div className="timeline-branch-line" />
                            <div className={`timeline-dot ${hoveredId === project.id ? 'timeline-dot-active' : ''}`}>
                                <div className="timeline-dot-ring" />
                            </div>
                        </div>

                        <div className="project-card">
                            {/* Top accent bar */}
                            <div className={`project-accent ${project.tag === 'NEXUS EVENT' ? 'accent-nexus' : project.tag === 'TEMPORAL ANOMALY' ? 'accent-anomaly' : 'accent-branch'}`} />

                            <div className="project-header">
                                <span className={`project-tag ${project.tag === 'NEXUS EVENT' ? 'tag-nexus' : project.tag === 'TEMPORAL ANOMALY' ? 'tag-anomaly' : 'tag-branch'}`}>
                                    ◈ {project.tag}
                                </span>
                                <span className="project-branch">BRANCH {project.branch}</span>
                            </div>

                            <h3 className="project-title">{project.title}</h3>
                            <p className="project-desc">{project.description}</p>

                            <div className="project-tech">
                                {project.tech.map((t, ti) => (
                                    <span key={ti} className="tech-tag">{t}</span>
                                ))}
                            </div>

                            {/* Temporal Variance Bar */}
                            <div className="project-variance">
                                <div className="variance-label">
                                    <span className="dim-text">TEMPORAL VARIANCE INDEX</span>
                                    <span className="orange-text">{project.timeVariance}%</span>
                                </div>
                                <div className="variance-bar">
                                    <div
                                        className="variance-fill"
                                        style={{ width: visibleCards.has(project.id) ? `${project.timeVariance}%` : '0%' }}
                                    />
                                    <div className="variance-threshold" />
                                </div>
                            </div>

                            <div className="project-footer">
                                <span className={`project-status ${project.status === 'ACTIVE' ? 'status-active-proj' : project.status === 'MONITORING' ? 'status-monitoring' : 'status-contained'}`}>
                                    ● {project.status}
                                </span>
                                <span className="project-id">{project.id}</span>
                            </div>

                            {/* Loki note — visible on hover */}
                            <div className={`project-loki-note ${hoveredId === project.id ? 'loki-note-visible' : ''}`}>
                                <span className="dim-text">// {project.lokiNote}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Timeline end */}
                <div className="timeline-end">
                    <div className="timeline-end-branches" aria-hidden="true">
                        <div className="end-branch end-branch-1" />
                        <div className="end-branch end-branch-2" />
                        <div className="end-branch end-branch-3" />
                    </div>
                    <span className="timeline-end-label">MULTIVERSE EXPANDS →</span>
                </div>
            </div>
        </section>
    )
}
