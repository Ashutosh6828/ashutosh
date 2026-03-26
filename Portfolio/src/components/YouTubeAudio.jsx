import { useEffect, useRef, useState } from 'react'

export default function YouTubeAudio({ trackId, startTime = 0, volume = 100, loop = false, fadeDuration = 0, isMuted = false }) {
    const containerRef = useRef(null)
    const playerRef = useRef(null)
    const [apiReady, setApiReady] = useState(() => !!window.YT)

    // 1. Load YouTube IFrame API
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script')
            tag.src = 'https://www.youtube.com/iframe_api'
            const firstScriptTag = document.getElementsByTagName('script')[0]
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
            window.onYouTubeIframeAPIReady = () => setApiReady(true)
        }
    }, [])

    // 2. Initialize Player
    useEffect(() => {
        if (!apiReady || !containerRef.current || !trackId) return

        // If a player already exists, destroy it
        if (playerRef.current) {
            playerRef.current.destroy()
        }

        const player = new window.YT.Player(containerRef.current, {
            height: '1',
            width: '1',
            videoId: trackId,
            playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                fs: 0,
                start: startTime,
                // loop requires playlist to be the same video ID
                loop: loop ? 1 : 0,
                playlist: loop ? trackId : undefined,
            },
            events: {
                onReady: (event) => {
                    const ytPlayer = event.target
                    if (fadeDuration > 0) {
                        ytPlayer.setVolume(0)
                        ytPlayer.playVideo()
                        // Fake a fade in
                        let currentVol = 0
                        const step = volume / (fadeDuration / 50)
                        const fadeInterval = setInterval(() => {
                            currentVol += step
                            if (currentVol >= volume) {
                                ytPlayer.setVolume(volume)
                                clearInterval(fadeInterval)
                            } else {
                                ytPlayer.setVolume(currentVol)
                            }
                        }, 50)
                    } else {
                        ytPlayer.setVolume(volume)
                        ytPlayer.playVideo()
                    }
                },
                onStateChange: () => {
                    // If track naturally ends and loop is true, YouTube handles it via playlist var
                }
            }
        })

        playerRef.current = player

        return () => {
            // Cleanup on unmount or track change
            if (playerRef.current) {
                playerRef.current.destroy()
                playerRef.current = null
            }
        }
    }, [apiReady, trackId, startTime, volume, loop, fadeDuration])

    // 3. Handle Muting dynamically
    useEffect(() => {
        if (playerRef.current && playerRef.current.mute && playerRef.current.unMute) {
            if (isMuted) {
                playerRef.current.mute()
            } else {
                playerRef.current.unMute()
            }
        }
    }, [isMuted, apiReady])

    // Return an empty div that YT will replace with an iframe
    return (
        <div style={{ position: 'absolute', opacity: 0.01, pointerEvents: 'none', zIndex: -100 }}>
            {/* Container for YT to attach to. Must use a dynamic key to force fresh DOM nodes if needed, 
          but YT.Player handles replacing the inner contents. */}
            <div ref={containerRef} />
        </div>
    )
}
