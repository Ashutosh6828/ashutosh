import { useEffect, useRef, useState } from 'react'

const PROJECTS = [
    {
        id: 'NE-001',
        title: 'CloudSentry AI',
        tag: 'TEMPORAL ANOMALY',
        description: 'AI-powered security pipeline ingesting AWS CloudTrail logs, detecting anomalies via Isolation Forest ML. Real-time Grafana dashboard centralizes threat visualization, drastically cutting manual log analysis time.',
        tech: ['Python', 'AWS CloudTrail', 'Isolation Forest', 'Grafana'],
        status: 'MONITORING',
        branch: '#001',
        timeVariance: 94,
        lokiNote: 'EY GDS Cloud & DevOps Program — He Who Remains flagged this',
        link: null,
    },
    {
        id: 'NE-002',
        title: 'CIPHRA',
        tag: 'BRANCH EVENT',
        description: 'Zero-knowledge secure vault app built with React Native. Stores passwords, files, and OTPs with AES-256-GCM encryption, Argon2id key derivation, biometric auth, and encrypted cloud sync — ensuring total data privacy.',
        tech: ['React Native', 'AES-256-GCM', 'Argon2id', 'Biometrics'],
        status: 'IN PROGRESS',
        branch: '#002',
        timeVariance: 60,
        lokiNote: 'Active development — timeline still branching',
        link: null,
    },
    {
        id: 'NE-003',
        title: 'SmartScan Checkout',
        tag: 'NEXUS EVENT',
        description: 'Autonomous retail checkout solution eliminating queue bottlenecks. Built on React/Firebase with a custom barcode scanning engine, real-time inventory sync, dynamic cart logic, and instant status notifications.',
        tech: ['React', 'Firebase', 'Cloud Firestore', 'Barcode Engine'],
        status: 'CONTAINED',
        branch: '#003',
        timeVariance: 87,
        lokiNote: 'Pruning risk: Low — timelines stabilized',
        link: null,
    },
    {
        id: 'NE-004',
        title: '3D JetVision',
        tag: 'NEXUS EVENT',
        description: 'High-fidelity 3D visualization platform for HAL Koraput Division, improving training efficiency by 20%. Delivered in an Agile team to serve as the primary training tool for new HAL recruits.',
        tech: ['3D Visualization', 'Agile', 'Stakeholder Design', 'UX'],
        status: 'CONTAINED',
        branch: '#004',
        timeVariance: 80,
        lokiNote: 'HAL Koraput cleared — Variant approved',
        link: null,
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
                                <span className={`project-status ${project.status === 'ACTIVE' ? 'status-active-proj' : project.status === 'MONITORING' ? 'status-monitoring' : project.status === 'IN PROGRESS' ? 'status-inprogress' : 'status-contained'}`}>
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
