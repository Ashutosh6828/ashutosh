import { useCallback } from 'react'

export function useTVAClick() {
    return useCallback(() => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext
            if (!AudioContext) return

            const ctx = new AudioContext()

            // We create two oscillators for a complex mechanical/analog click
            const osc1 = ctx.createOscillator()
            const osc2 = ctx.createOscillator()
            const gain = ctx.createGain()
            const filter = ctx.createBiquadFilter()

            // High-tech analog chirp
            osc1.type = 'square'
            osc1.frequency.setValueAtTime(800, ctx.currentTime)
            osc1.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04)

            // Lower mechanical thud
            osc2.type = 'triangle'
            osc2.frequency.setValueAtTime(200, ctx.currentTime)
            osc2.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.04)

            filter.type = 'bandpass'
            filter.frequency.value = 1200
            filter.Q.value = 2

            // Very fast decay for a crisp click
            gain.gain.setValueAtTime(0.08, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

            osc1.connect(filter)
            osc2.connect(filter)
            filter.connect(gain)
            gain.connect(ctx.destination)

            osc1.start(ctx.currentTime)
            osc2.start(ctx.currentTime)
            osc1.stop(ctx.currentTime + 0.04)
            osc2.stop(ctx.currentTime + 0.04)
        } catch {
            // Ignore audio errors if context is locked or unsupported
        }
    }, [])
}
