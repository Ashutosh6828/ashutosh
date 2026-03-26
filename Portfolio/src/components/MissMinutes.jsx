import { useState, useRef, useEffect } from 'react'

// Miss Minutes Knowledge Base
const PORTFOLIO_DATA = {
    name: 'Ashutosh Maharana',
    role: 'Software Engineer',
    specialization: 'Cybersecurity',
    sideHustles: ['Designer', 'Video Editor', 'Photographer'],
    skills: {
        security: ['Network Security', 'Penetration Testing', 'Threat Analysis', 'Incident Response', 'Cryptography'],
        dev: ['React', 'JavaScript', 'Python', 'Node.js', 'Cloud/DevOps', 'Database Systems'],
        creative: ['UI/UX Design', 'Video Editing', 'Photography', 'Motion Graphics', 'Brand Design'],
    },
    projects: [
        { name: 'SmartScan Checkout', desc: 'Autonomous retail checkout with barcode scanning and Firebase' },
        { name: 'Cyber Sentinel', desc: 'ML-powered threat detection system for network security' },
        { name: 'PixelForge Studio', desc: 'Creative suite dashboard for design and video workflows' },
        { name: 'VaultGuard', desc: 'Zero-knowledge encrypted password vault with biometric auth' },
    ],
}

// Pattern-matched responses in Miss Minutes's voice
const RESPONSE_PATTERNS = [
    // Greetings
    {
        patterns: [/^(hi|hello|hey|greetings|howdy|sup|what'?s up)/i],
        responses: [
            "Hey y'all! 🕐 Welcome to Ashutosh's TVA Personnel File! I'm Miss Minutes, your friendly guide through this here timeline. What would you like to know about our favorite Variant?",
            "Well, howdy there, sugar! ⏰ I'm Miss Minutes! Ask me anything about Ashutosh — his skills, projects, or even some fun TVA facts!",
            "Hey there, partner! 🕐 Glad you stopped by! I know everything about Ashutosh Maharana — go ahead, ask me anything!",
        ]
    },

    // Who is Ashutosh
    {
        patterns: [/who.*(is|about).*ashutosh/i, /tell.*about.*(him|ashutosh|you)/i, /about.*ashutosh/i, /who.*are.*you/i],
        responses: [
            `Well now, let me pull up his file! 📋 Ashutosh Maharana is a ${PORTFOLIO_DATA.role} specializing in ${PORTFOLIO_DATA.specialization}. But honey, that ain't all — he's also a ${PORTFOLIO_DATA.sideHustles.join(', ')}! A real multi-timeline operator, if you ask me. The TVA's been keepin' a close eye on this Variant! 👀`,
            `Oh, sugar, where do I begin? 🕐 Ashutosh is a ${PORTFOLIO_DATA.role} with a knack for ${PORTFOLIO_DATA.specialization}. He also moonlights as a ${PORTFOLIO_DATA.sideHustles.join(' and ')}. Quite the Variant, I tell ya!`,
        ]
    },

    // Skills
    {
        patterns: [/skill/i, /what.*can.*do/i, /capabilities/i, /tech.*stack/i, /what.*know/i],
        responses: [
            `Oh my stars, this Variant's got quite the skill set! 🌟\n\n🔒 Security: ${PORTFOLIO_DATA.skills.security.slice(0, 3).join(', ')}\n💻 Dev: ${PORTFOLIO_DATA.skills.dev.slice(0, 3).join(', ')}\n🎨 Creative: ${PORTFOLIO_DATA.skills.creative.slice(0, 3).join(', ')}\n\nHe's got a Temporal Variance Index that's off the charts, sugar!`,
            `Well ain't you curious! Here's what our Variant's packin':\n\n🔐 Cybersecurity ops like Pen Testing & Threat Analysis\n⚛️ Full-stack dev with React, Python, Node.js\n🎭 Creative work — Design, Video, Photography\n\nThe TVA classified him as a Minuteman-rank talent!`,
        ]
    },

    // Projects
    {
        patterns: [/project/i, /nexus.*event/i, /what.*built/i, /portfolio/i, /work/i],
        responses: [
            `Oh, those are what we call Nexus Events 'round here! 🌀\n\n${PORTFOLIO_DATA.projects.map((p, i) => `${i + 1}. **${p.name}** — ${p.desc}`).join('\n')}\n\nEach one's a timeline branch that the TVA's been monitorin'! Agent Mobius is particularly impressed with these.`,
        ]
    },

    // Security / Cybersecurity
    {
        patterns: [/security|cyber|hack|pentest|threat/i],
        responses: [
            `Now that's Ashutosh's primary timeline, sugar! 🔒 He specializes in ${PORTFOLIO_DATA.skills.security.join(', ')}. Think of him as the TVA's own digital guardian — protectin' timelines from temporal anomalies and cyber threats! Even He Who Remains... well, even *y'know who* would've wanted him on the team. 😉`,
        ]
    },

    // Design / Creative
    {
        patterns: [/design|creative|photo|video|edit|visual/i],
        responses: [
            `Oh honey, Ashutosh ain't just about the code! 🎨 He branches out into ${PORTFOLIO_DATA.skills.creative.join(', ')}. It's like havin' multiple Variants of expertise all in one person! His design work is prettier than a sunset on the Sacred Timeline, I tell ya!`,
        ]
    },

    // Contact
    {
        patterns: [/contact|hire|email|reach|connect|message/i],
        responses: [
            "Wanna get in touch with our Variant? 📡 Just scroll on down to the Communication Terminal at the bottom! You can transmit a message directly, or use the Secure Channels — LinkedIn, GitHub, Twitter, and Email. The TVA-approved way to connect! And remember, all channels are encrypted! 🔐",
        ]
    },

    // Loki references
    {
        patterns: [/loki|god.*mischief|variant/i],
        responses: [
            "Oh, don't even get me started on that troublemaker! 😤 But between you and me... Loki taught us all somethin' about writing our own destiny. Ashutosh here? He's a Loki-class Variant — refuses to follow the Sacred Timeline when a better path exists! And that's why the TVA recruited him. 💚",
            "Loki? Ha! That slippery Variant sure did shake things up! 🐍 But y'know what? Without him, we wouldn't have learned that every timeline matters. Ashutosh embodies that same spirit — breakin' boundaries and creatin' new paths!",
        ]
    },

    // TVA
    {
        patterns: [/tva|time.*variance|sacred.*timeline/i],
        responses: [
            "The Time Variance Authority — that's us, sugar! 🏛️ We monitor the Sacred Timeline and prune any dangerous branches. This portfolio? It's Ashutosh's official TVA personnel file! Everything you see has been classified, categorized, and approved by Judge Ravonna Renslayer herself! For All Time. Always. ⏰",
        ]
    },

    // Doom / Marvel
    {
        patterns: [/doom|doctor.*doom|victor|latveria|marvel|mcu|avengers/i],
        responses: [
            "Oh my, don't even mention Doctor Doom around here! 😱 After the whole situation at the Citadel at the End of Time, the multiverse is wide open. And now with Victor Von Doom risin' to power... well, let's just say the TVA has its hands full! But Ashutosh? He's exactly the kind of Variant we need — cybersecurity expertise to protect against Doom's tech! 🛡️",
            "The MCU's movin' in some wild directions, ain't it? 🎬 With Doom takin' center stage, the multiverse needs defenders more than ever. Good thing Ashutosh is on our side! His security skills would make even Latveria's defenses look like child's play! ⏰",
        ]
    },

    // Miss Minutes herself
    {
        patterns: [/miss.*minutes|who.*are.*you|clock|you/i],
        responses: [
            "Aww, askin' about little ol' me? 🥰 I'm Miss Minutes, the TVA's administrative assistant! I've been keepin' track of timelines since... well, since time began! And now I'm here to help you navigate Ashutosh's portfolio. Think of me as your friendly guide through the temporal bureaucracy! ⏰",
        ]
    },

    // Mobius
    {
        patterns: [/mobius|jet.*ski/i],
        responses: [
            "Agent Mobius M. Mobius! 🛥️ Now THERE'S a man who knows what he wants — a jet ski and a peaceful timeline! He's Ashutosh's assigned TVA handler, and between you and me, he's mighty impressed with this Variant's work. Keeps sayin' somethin' about 'finally, a Variant who builds instead of destroys!' 😄",
        ]
    },

    // Sylvie
    {
        patterns: [/sylvie|enchantress/i],
        responses: [
            "Sylvie! Oh, that girl sure did change everything when she... well, you know. 🗡️ She taught us that sometimes breakin' the rules is how you find your true purpose. Ashutosh's got a bit of that Sylvie energy too — always pushin' boundaries in cybersecurity! 💪",
        ]
    },

    // Fun / Easter egg
    {
        patterns: [/easter.*egg|secret|hidden|surprise/i],
        responses: [
            "Ooh, lookin' for secrets, are ya? 🤫 Well, I'll give ya a hint: try the Konami Code on this page! ↑↑↓↓←→←→BA. Also, keep an eye on that scan line runnin' across the screen — that's a real CRT effect, just like the monitors here at the TVA! And did you notice the 'CLASSIFIED' stamp on the Case File? 😉",
        ]
    },

    // Navigate
    {
        patterns: [/scroll|navigate|go.*to|show.*me|take.*me/i],
        responses: [
            "Sure thing, sugar! 🕐 You can use the navigation bar at the top — it's styled like a TemPad! Click on CASE FILE for the about section, ANALYSIS for skills, NEXUS EVENTS for projects, EVIDENCE for the gallery, or COMMS to send a message. Or just scroll down — I promise the timeline won't branch! 😄",
        ]
    },

    // Thank you
    {
        patterns: [/thank|thanks|appreciate/i],
        responses: [
            "Aww, you're welcome, sugar! 🥰 It's my pleasure helpin' folks navigate this timeline. And remember — behave! ⏰ For All Time. Always!",
            "Don't mention it, darlin'! 😊 That's what I'm here for! Now go explore the rest of Ashutosh's portfolio — there's plenty more Nexus Events to discover! ⏰",
        ]
    },
]

// Default/fallback responses
const FALLBACK_RESPONSES = [
    "Well now, I ain't quite sure what you mean, sugar! 🤔 Try askin' me about Ashutosh's skills, projects, or even about Loki and the TVA! I know it all! ⏰",
    "Hmm, that's a timeline I haven't explored yet! 😅 Ask me about Ashutosh's work, his cybersecurity expertise, or any Marvel/TVA related questions!",
    "Oh my, that's beyond even my temporal knowledge! 🕐 Try askin' about projects, skills, or the TVA — I'm an expert on those timelines!",
]

function getResponse(input) {
    const trimmed = input.trim()
    if (!trimmed) return null

    for (const pattern of RESPONSE_PATTERNS) {
        for (const regex of pattern.patterns) {
            if (regex.test(trimmed)) {
                const responses = pattern.responses
                return responses[Math.floor(Math.random() * responses.length)]
            }
        }
    }

    return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
}

// Component
export default function MissMinutes() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hey y'all! 🕐 I'm Miss Minutes, your guide to Ashutosh's TVA portfolio! Ask me anything — skills, projects, Marvel facts, or just say hi!", timestamp: new Date() },
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const chatEndRef = useRef(null)
    const inputRef = useRef(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    const handleSend = () => {
        if (!input.trim() || isTyping) return

        const userMsg = { role: 'user', text: input.trim(), timestamp: new Date() }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsTyping(true)

        // Simulate "thinking" delay
        const delay = 600 + Math.random() * 800
        setTimeout(() => {
            const response = getResponse(userMsg.text)
            setMessages(prev => [...prev, { role: 'assistant', text: response, timestamp: new Date() }])
            setIsTyping(false)
        }, delay)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <>
            {/* Chat Toggle Button — Miss Minutes Face */}
            <button
                className={`mm-chat-toggle ${isOpen ? 'mm-chat-toggle-open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title={isOpen ? 'Close Miss Minutes' : "Chat with Miss Minutes"}
                aria-label="Toggle Miss Minutes chat"
            >
                <div className="mm-toggle-face">
                    <div className="mm-t-eye mm-t-eye-l" />
                    <div className="mm-t-eye mm-t-eye-r" />
                    <div className="mm-t-smile" />
                    <div className="mm-t-hand-h" />
                    <div className="mm-t-hand-m" />
                </div>
                {!isOpen && <span className="mm-toggle-label">Ask Miss Minutes</span>}
                {isOpen && <span className="mm-toggle-x">✕</span>}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className="mm-chat-panel">
                    {/* Header */}
                    <div className="mm-chat-header">
                        <div className="mm-chat-header-left">
                            <span className="mm-chat-logo">🕐</span>
                            <div>
                                <span className="mm-chat-title">MISS MINUTES</span>
                                <span className="mm-chat-subtitle">TVA TEMPORAL ASSISTANT</span>
                            </div>
                        </div>
                        <span className="mm-chat-status">● ONLINE</span>
                    </div>

                    {/* Messages */}
                    <div className="mm-chat-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`mm-msg ${msg.role === 'assistant' ? 'mm-msg-assistant' : 'mm-msg-user'}`}>
                                {msg.role === 'assistant' && <span className="mm-msg-avatar">🕐</span>}
                                <div className="mm-msg-bubble">
                                    <span className="mm-msg-text">{msg.text}</span>
                                    <span className="mm-msg-time">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="mm-msg mm-msg-assistant">
                                <span className="mm-msg-avatar">🕐</span>
                                <div className="mm-msg-bubble mm-typing">
                                    <span className="mm-typing-dot" />
                                    <span className="mm-typing-dot" />
                                    <span className="mm-typing-dot" />
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Quick Actions */}
                    <div className="mm-quick-actions">
                        {['Skills', 'Projects', 'Contact', 'Easter Eggs'].map(q => (
                            <button
                                key={q}
                                className="mm-quick-btn"
                                onClick={() => { setInput(q); setTimeout(() => { setInput(q); handleSend() }, 50) }}
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="mm-chat-input-row">
                        <input
                            ref={inputRef}
                            type="text"
                            className="mm-chat-input"
                            placeholder="Ask Miss Minutes..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button className="mm-chat-send" onClick={handleSend} disabled={isTyping}>
                            ◈
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
