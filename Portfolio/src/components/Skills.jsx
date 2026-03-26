import { useEffect, useRef, useState } from 'react'

const SKILL_CATEGORIES = [
    {
        title: 'CYBERSECURITY OPS',
        rank: 'MINUTEMAN RANK',
        skills: [
            { name: 'Network Security', level: 92 },
            { name: 'Penetration Testing', level: 85 },
            { name: 'Threat Analysis', level: 88 },
            { name: 'Incident Response', level: 80 },
            { name: 'Cryptography', level: 78 },
        ],
    },
    {
        title: 'DEVELOPMENT',
        rank: 'HUNTER RANK',
        skills: [
            { name: 'React / JavaScript', level: 90 },
            { name: 'Python', level: 85 },
            { name: 'Node.js', level: 82 },
            { name: 'Cloud / DevOps', level: 75 },
            { name: 'Database Systems', level: 80 },
        ],
    },
    {
        title: 'CREATIVE OPS',
        rank: 'ANALYST RANK',
        skills: [
            { name: 'UI/UX Design', level: 85 },
            { name: 'Video Editing', level: 88 },
            { name: 'Photography', level: 82 },
            { name: 'Motion Graphics', level: 75 },
            { name: 'Brand Design', level: 78 },
        ],
    },
]

export default function Skills() {
    const [animated, setAnimated] = useState(false)
    const sectionRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setAnimated(true)
                    entry.target.classList.add('section-visible')
                }
            },
            { threshold: 0.1 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <section id="skills" className="section skills-section" ref={sectionRef}>
            <div className="section-header">TVA TEMPORAL ANALYSIS DIVISION</div>
            <h2 className="section-title">VARIANT CAPABILITIES</h2>

            <div className="skills-grid">
                {SKILL_CATEGORIES.map((cat, ci) => (
                    <div key={ci} className="skill-category">
                        <div className="skill-category-header">
                            <span className="skill-cat-title">{cat.title}</span>
                            <span className="skill-cat-rank">{cat.rank}</span>
                        </div>
                        <div className="skill-list">
                            {cat.skills.map((skill, si) => (
                                <div key={si} className="skill-item">
                                    <div className="skill-info">
                                        <span className="skill-name">&gt; {skill.name}</span>
                                        <span className="skill-level">{skill.level}%</span>
                                    </div>
                                    <div className="skill-bar">
                                        <div
                                            className="skill-bar-fill"
                                            style={{
                                                width: animated ? `${skill.level}%` : '0%',
                                                transitionDelay: `${ci * 0.2 + si * 0.1}s`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Data readout effect */}
                        <div className="skill-readout">
                            <span className="dim-text">
                                TEMPORAL STABILITY: {cat.skills.reduce((a, b) => a + b.level, 0) / cat.skills.length | 0}% ━━ NOMINAL
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
