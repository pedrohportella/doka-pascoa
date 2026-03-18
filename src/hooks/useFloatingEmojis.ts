import { useCallback } from 'react'

const EMOJIS = ['🍫', '🐣', '🌸', '🌷', '✨', '🎉']

export function useFloatingEmojis() {
  const launch = useCallback(() => {
    const count = 18
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span')
      el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
      el.className = 'floating-emoji'
      el.style.left = `${Math.random() * 100}vw`
      el.style.bottom = '-60px'
      const duration = 2.5 + Math.random() * 2
      el.style.animationDuration = `${duration}s`
      el.style.animationDelay = `${Math.random() * 1}s`
      el.style.fontSize = `${1.5 + Math.random() * 1.5}rem`
      document.body.appendChild(el)
      setTimeout(() => el.remove(), (duration + 1.5) * 1000)
    }
  }, [])

  return launch
}
