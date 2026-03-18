import { useEffect, useRef, useState } from 'react'

interface HeroProps {
  onOpenModal: () => void
}

export function Hero({ onOpenModal }: HeroProps) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const cls = (delay: string) =>
    `transition-all duration-700 ease-out ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
    } ${delay}`

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232,196,184,0.55) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 100%, rgba(74,107,138,0.18) 0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 10% 80%, rgba(201,169,110,0.2) 0%, transparent 50%),
          linear-gradient(160deg, #F5F0E8 0%, #EDE5D5 40%, #F0E8E0 70%, #E8DDD0 100%)
        `,
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #E8C4B8 0%, transparent 70%)',
          transform: 'translate(-30%, -30%)',
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #44607C 0%, transparent 70%)',
          transform: 'translate(30%, 30%)',
        }}
      />
      <div
        className="absolute top-1/2 left-0 w-48 h-48 rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #C9A96E 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Floating decorative elements */}
      <span
        className="absolute top-16 left-8 text-4xl select-none pointer-events-none opacity-40 md:opacity-60"
        style={{ animation: 'float 4s ease-in-out infinite' }}
        aria-hidden
      >
        🌸
      </span>
      <span
        className="absolute top-24 right-10 text-3xl select-none pointer-events-none opacity-30 md:opacity-50"
        style={{ animation: 'float 5s ease-in-out infinite 1s' }}
        aria-hidden
      >
        🍫
      </span>
      <span
        className="absolute bottom-20 left-12 text-3xl select-none pointer-events-none opacity-30 md:opacity-50"
        style={{ animation: 'float 3.5s ease-in-out infinite 0.5s' }}
        aria-hidden
      >
        🐣
      </span>
      <span
        className="absolute bottom-32 right-16 text-2xl select-none pointer-events-none opacity-25 md:opacity-40"
        style={{ animation: 'float 4.5s ease-in-out infinite 1.5s' }}
        aria-hidden
      >
        🌷
      </span>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Badge */}
        <div className={cls('delay-[0ms]')}>
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{
              background: 'rgba(201,169,110,0.18)',
              border: '1px solid rgba(201,169,110,0.5)',
              color: '#8A6B3A',
              backdropFilter: 'blur(4px)',
            }}
          >
            🐣 Páscoa 2026
          </span>
        </div>

        {/* Headline */}
        <h1
          className={`font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 ${cls('delay-[150ms]')}`}
          style={{ color: '#334B61', letterSpacing: '-0.02em' }}
        >
          Ganhe um Ovo{' '}
          <span
            className="italic"
            style={{ color: '#44607C' }}
          >
            Especial
          </span>{' '}
          <br className="hidden sm:block" />
          da Doka
        </h1>

        {/* Script tagline */}
        <p
          className={`font-script text-xl md:text-2xl mb-5 ${cls('delay-[250ms]')}`}
          style={{ color: '#C9A96E' }}
        >
          Sabor que vira memória — e agora pode ser seu de presente 🍫
        </p>

        {/* Description */}
        <p
          className={`text-base md:text-lg leading-relaxed mb-10 max-w-lg mx-auto ${cls('delay-[350ms]')}`}
          style={{ color: '#5A7A96' }}
        >
          Participe do nosso sorteio e concorra a um dos nossos ovos especiais
          de Páscoa, feito com amor e ingredientes artesanais. Para participar,
          é simples!
        </p>

        {/* CTA Button */}
        <div className={cls('delay-[450ms]')}>
          <button
            onClick={onOpenModal}
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full text-base md:text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #44607C 0%, #5A7A96 100%)',
              boxShadow: '0 4px 20px rgba(92,61,46,0.35)',
            }}
          >
            <span>Quero Participar!</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>

        {/* Brand name subtle */}
        <p
          className={`mt-8 text-xs tracking-widest uppercase ${cls('delay-[550ms]')}`}
          style={{ color: '#B08A50', letterSpacing: '0.18em' }}
        >
          — Doka • @querodoka —
        </p>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-16 md:h-20"
        >
          <path
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="#F5F0E8"
            fillOpacity="0.6"
          />
          <path
            d="M0,55 C480,10 960,75 1440,55 L1440,80 L0,80 Z"
            fill="#F5F0E8"
          />
        </svg>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(5deg); }
        }
      `}</style>
    </section>
  )
}
