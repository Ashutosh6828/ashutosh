import { useState, useCallback, useEffect, lazy, Suspense } from 'react'
import './App.css'
import ScanLines from './components/ScanLines'
import BootSequence from './components/BootSequence'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import { useTVAClick } from './hooks/useTVAClick'
import YouTubeAudio from './components/YouTubeAudio'

// Lazy loaded components to reduce initial bundle size (performance optimization)
const About = lazy(() => import('./components/About'))
const Skills = lazy(() => import('./components/Skills'))
const Projects = lazy(() => import('./components/Projects'))
const Gallery = lazy(() => import('./components/Gallery'))
const Contact = lazy(() => import('./components/Contact'))
const MissMinutes = lazy(() => import('./components/MissMinutes'))

export default function App() {
  const [booted, setBooted] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [doomMode, setDoomMode] = useState(false)
  const [isMuted, setIsMuted] = useState(true) // Start muted until user interacts

  // Default track on boot: History Is Now (MjYwF_0EhTU) looping at 30% volume
  const [activeTrack, setActiveTrack] = useState({
    id: 'MjYwF_0EhTU',
    start: 0,
    volume: 30,
    fadeDuration: 2000,
    loop: true,
    key: 'init'
  })
  const playClick = useTVAClick()

  const playAudio = useCallback((trackId) => {
    // Keys format: { id, start, volume, fadeDuration, loop }
    const trackMap = {
      // Double click logo (Soft start / fade in over 4 seconds)
      theme: { id: 'XVWq2rOUvgY', start: 0, volume: 100, fadeDuration: 4000, loop: false },
      // Click Quote
      glorious: { id: 'XVWq2rOUvgY', start: 42, volume: 100, fadeDuration: 500, loop: false },
      // Konami code = Ascension
      konami: { id: 'suXLyqzLpcA', start: 0, volume: 100, fadeDuration: 1000, loop: false },
    }
    const track = trackMap[trackId]
    if (track) {
      // Use timestamp as key to force the YouTube API to re-init
      setActiveTrack({ ...track, key: Date.now() })
    }
  }, [])

  const handleBootComplete = useCallback(() => {
    setBooted(true)
  }, [])

  // DOOM Easter Egg: Type "DOOM"
  useEffect(() => {
    const konamiCode = ['KeyD', 'KeyO', 'KeyO', 'KeyM']
    let konamiIndex = 0

    const handleKeyDown = (e) => {
      // Ignore key events from inputs to avoid false triggers while typing messages
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++
        if (konamiIndex === konamiCode.length) {
          konamiIndex = 0
          if (!doomMode) {
            setTransitioning(true)
            setTimeout(() => {
              setDoomMode(true)
              playAudio('konami') // Secret audio track on DOOM! (Ascension)
              setIsMuted(false) // Force unmute to ensure they hear it
            }, 1000) // swap precisely at the peak of the 2s flash
            setTimeout(() => setTransitioning(false), 2000)
          }
        }
      } else {
        // Reset if they type the wrong key, but allow finding 'D' again immediately
        konamiIndex = e.code === 'KeyD' ? 1 : 0
      }
    }

    const revertCode = ['KeyL', 'KeyO', 'KeyK', 'KeyI']
    let revertIndex = 0

    const handleRevertKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      if (e.code === revertCode[revertIndex]) {
        revertIndex++
        if (revertIndex === revertCode.length) {
          revertIndex = 0
          if (doomMode) {
            setTransitioning(true)
            setTimeout(() => {
              setDoomMode(false)
              // Reset to default looping ambiance
              setActiveTrack({
                id: 'MjYwF_0EhTU',
                start: 0,
                volume: 30,
                fadeDuration: 2000,
                loop: true,
                key: Date.now()
              })
            }, 1000)
            setTimeout(() => setTransitioning(false), 2000)
          }
        }
      } else {
        revertIndex = e.code === 'KeyL' ? 1 : 0
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keydown', handleRevertKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keydown', handleRevertKeyDown)
    }
  }, [playAudio, doomMode])

  // Global click sound for interactive elements
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const isInteractive = e.target.closest('button, a, input, textarea, .nav-link, .hero-loki-quote, .navbar-logo, .st-branch')
      if (isInteractive) {
        playClick()
      }
    }
    window.addEventListener('click', handleGlobalClick)
    return () => window.removeEventListener('click', handleGlobalClick)
  }, [playClick, isMuted])

  return (
    <div className={`app ${transitioning ? 'app-transitioning' : ''} ${doomMode ? 'app-doom' : ''}`}>
      <ScanLines />

      {/* Rotating Media Player Mute Toggle */}
      {booted && (
        <button
          className={`media-player-btn ${!isMuted ? 'playing' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            setIsMuted(!isMuted)
          }}
          title={isMuted ? "Unmute Audio Loop" : "Mute Audio"}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Simple vinyl/TVA tape icon */}
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray={!isMuted ? "4 4" : "none"} />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <path d="M12 6V12L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {activeTrack && (
        <YouTubeAudio
          key={activeTrack.key}
          trackId={activeTrack.id}
          startTime={activeTrack.start}
          volume={activeTrack.volume}
          fadeDuration={activeTrack.fadeDuration}
          loop={activeTrack.loop}
          isMuted={isMuted}
        />
      )}

      {!booted && <BootSequence onComplete={handleBootComplete} />}

      <div className={`main-content ${booted ? 'main-content-visible' : ''}`}>
        <Navbar playAudio={playAudio} />
        <Hero playAudio={playAudio} />

        {booted && (
          <Suspense fallback={<div className="tva-loader">Loading Archives...</div>}>
            <About />
            <Skills />
            <Projects />
            <Gallery />
            <Contact />
          </Suspense>
        )}
      </div>

      {/* Miss Minutes Chat — global, always available after boot */}
      {booted && (
        <Suspense fallback={null}>
          <MissMinutes />
        </Suspense>
      )}
    </div>
  )
}
