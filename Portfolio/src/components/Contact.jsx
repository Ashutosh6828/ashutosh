import { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser'

// ─── EmailJS Configuration ───
// To make this work, you need to:
// 1. Create a free account at https://www.emailjs.com
// 2. Add an email service (Gmail, etc.)
// 3. Create an email template with variables: {{from_name}}, {{from_email}}, {{message}}
// 4. Replace the values below with your actual IDs
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'   // Replace with your EmailJS service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID' // Replace with your EmailJS template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'    // Replace with your EmailJS public key
const CONTACT_EMAIL = 'maharana.contact@gmail.com'

export default function Contact() {
    const sectionRef = useRef(null)
    const formRef = useRef(null)
    const [formData, setFormData] = useState({ from_name: '', from_email: '', message: '' })
    const [status, setStatus] = useState('idle') // idle | sending | sent | error
    const [currentTime, setCurrentTime] = useState('')

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

        const clock = setInterval(() => {
            const now = new Date()
            setCurrentTime(now.toISOString().replace('T', ' ').split('.')[0] + ' UTC')
        }, 1000)

        return () => { observer.disconnect(); clearInterval(clock) }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('sending')

        try {
            // If EmailJS is configured, use it
            if (EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID') {
                await emailjs.sendForm(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    formRef.current,
                    EMAILJS_PUBLIC_KEY
                )
            } else {
                // Fallback: Use Web3Forms (free, no signup needed for basic use)
                // Or open mailto as fallback
                const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=TVA Communication from ${formData.from_name}&body=${encodeURIComponent(
                    `From: ${formData.from_name} (${formData.from_email})\n\n${formData.message}`
                )}`
                window.open(mailtoLink, '_blank')
            }

            setStatus('sent')
            setFormData({ from_name: '', from_email: '', message: '' })
            setTimeout(() => setStatus('idle'), 5000)
        } catch (error) {
            console.error('Email send failed:', error)
            setStatus('error')
            setTimeout(() => setStatus('idle'), 4000)
        }
    }

    return (
        <section id="contact" className="section contact-section" ref={sectionRef}>
            <div className="section-header">TVA SECURE COMMUNICATIONS</div>
            <h2 className="section-title">COMMUNICATION TERMINAL</h2>

            <div className="contact-grid">
                {/* Terminal Form */}
                <div className="contact-terminal">
                    <div className="terminal-bar">
                        <span className="terminal-dot red" />
                        <span className="terminal-dot yellow" />
                        <span className="terminal-dot green" />
                        <span className="terminal-title">tva_comms.exe — {CONTACT_EMAIL}</span>
                    </div>

                    {status === 'sent' ? (
                        <div className="terminal-success">
                            <p className="success-icon">◈</p>
                            <p>&gt; MESSAGE TRANSMITTED SUCCESSFULLY</p>
                            <p>&gt; DELIVERED TO: {CONTACT_EMAIL}</p>
                            <p>&gt; TVA WILL RESPOND WITHIN 24 TEMPORAL UNITS</p>
                            <p className="orange-text">&gt; FOR ALL TIME. ALWAYS.</p>
                        </div>
                    ) : status === 'error' ? (
                        <div className="terminal-error">
                            <p>&gt; ⚠ TEMPORAL DISRUPTION — TRANSMISSION FAILED</p>
                            <p>&gt; PLEASE TRY AGAIN OR USE SECURE CHANNELS</p>
                            <p className="dim-text">&gt; The Sacred Timeline may be experiencing interference.</p>
                        </div>
                    ) : (
                        <form className="terminal-form" ref={formRef} onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">&gt; IDENTIFY_YOURSELF</label>
                                <input
                                    type="text"
                                    name="from_name"
                                    className="form-input"
                                    placeholder="Enter designation..."
                                    value={formData.from_name}
                                    onChange={e => setFormData({ ...formData, from_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">&gt; TEMPORAL_ADDRESS</label>
                                <input
                                    type="email"
                                    name="from_email"
                                    className="form-input"
                                    placeholder="Enter email beacon..."
                                    value={formData.from_email}
                                    onChange={e => setFormData({ ...formData, from_email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">&gt; TRANSMIT_MESSAGE</label>
                                <textarea
                                    name="message"
                                    className="form-input form-textarea"
                                    placeholder="Compose your message to the TVA..."
                                    rows={4}
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    required
                                />
                            </div>
                            {/* Hidden field for recipient */}
                            <input type="hidden" name="to_email" value={CONTACT_EMAIL} />

                            <div className="form-actions">
                                <button type="submit" className="form-submit" disabled={status === 'sending'}>
                                    {status === 'sending' ? (
                                        <><span className="submit-spinner" /> TRANSMITTING...</>
                                    ) : (
                                        <>◈ TRANSMIT TO TVA</>
                                    )}
                                </button>
                                <span className="form-hint dim-text">
                                    → Delivers to {CONTACT_EMAIL}
                                </span>
                            </div>
                        </form>
                    )}
                </div>

                {/* Secure Channels */}
                <div className="contact-channels">
                    <div className="channel-header">SECURE CHANNELS</div>

                    <a href="https://github.com/ashutosh" target="_blank" rel="noopener noreferrer" className="channel-link">
                        <span className="channel-icon">◈</span>
                        <span className="channel-name">GitHub</span>
                        <span className="channel-status">ENCRYPTED</span>
                    </a>
                    <a href="https://www.linkedin.com/in/ashutoshmaharana004/" target="_blank" rel="noopener noreferrer" className="channel-link">
                        <span className="channel-icon">◈</span>
                        <span className="channel-name">LinkedIn</span>
                        <span className="channel-status">ENCRYPTED</span>
                    </a>
                    <a href="https://twitter.com/ashutosh" target="_blank" rel="noopener noreferrer" className="channel-link">
                        <span className="channel-icon">◈</span>
                        <span className="channel-name">X / Twitter</span>
                        <span className="channel-status">ENCRYPTED</span>
                    </a>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="channel-link channel-link-primary">
                        <span className="channel-icon">◈</span>
                        <span className="channel-name">Email</span>
                        <span className="channel-status channel-status-direct">DIRECT</span>
                    </a>

                    <div className="channel-footer">
                        <span className="dim-text">RECIPIENT: {CONTACT_EMAIL}</span>
                        <span className="dim-text" style={{ marginTop: '4px' }}>SYSTEM TIME: {currentTime}</span>
                    </div>

                    <div className="channel-doom-note">
                        <span className="dim-text">⚠ All channels monitored for Doom-class threats</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="tva-footer">
                <div className="footer-line" />
                <div className="footer-content">
                    <span className="footer-logo">TVA</span>
                    <span className="footer-tagline">FOR ALL TIME. ALWAYS.</span>
                    <span className="footer-copy dim-text">© TEMPORAL VARIANCE AUTHORITY — ALL TIMELINES RESERVED</span>
                    <span className="footer-doom dim-text">POST-DOOM EMERGENCE ERA • MULTIVERSE PROTECTED</span>
                </div>
            </footer>
        </section>
    )
}
