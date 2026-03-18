import { useEffect, useRef, useState } from 'react'

interface Step {
  emoji: string
  number: string
  title: string
  description: string
}

const steps: Step[] = [
  {
    emoji: '📲',
    number: '01',
    title: 'Siga no Instagram',
    description: 'Siga @querodoka no Instagram e fique por dentro de todas as novidades da Doka.',
  },
  {
    emoji: '🔁',
    number: '02',
    title: 'Compartilhe nos Stories',
    description: 'Compartilhe a publicação do sorteio nos seus Stories e marque @querodoka.',
  },
  {
    emoji: '📸',
    number: '03',
    title: 'Envie o formulário',
    description: 'Preencha o formulário abaixo com o print do seu story para confirmar sua participação.',
  },
]

export function HowToParticipate({ onOpenModal }: { onOpenModal: () => void }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.15 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="py-20 px-6"
      style={{ background: 'linear-gradient(180deg, #F5F0E8 0%, #EDE5D5 100%)' }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span
            className="inline-block text-sm font-medium tracking-widest uppercase mb-3"
            style={{ color: '#C9A96E', letterSpacing: '0.15em' }}
          >
            Participação
          </span>
          <h2
            className="font-serif text-3xl md:text-4xl font-bold"
            style={{ color: '#3E2920' }}
          >
            Como participar?
          </h2>
          <div
            className="mx-auto mt-4 h-0.5 w-16 rounded-full"
            style={{ background: 'linear-gradient(90deg, #C9A96E, #E8C4B8)' }}
          />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`relative transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${150 + i * 120}ms` }}
            >
              <div
                className="relative rounded-2xl p-6 md:p-8 h-full flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-300"
                style={{
                  background: 'rgba(255,255,255,0.65)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(201,169,110,0.25)',
                  boxShadow: '0 4px 24px rgba(92,61,46,0.08)',
                }}
              >
                {/* Step number */}
                <span
                  className="absolute top-4 right-5 font-serif font-bold text-3xl select-none"
                  style={{ color: 'rgba(201,169,110,0.25)', lineHeight: 1 }}
                >
                  {step.number}
                </span>

                {/* Emoji icon */}
                <div
                  className="mb-4 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #F2D8CE 0%, #EDE5D5 100%)',
                    boxShadow: '0 2px 12px rgba(201,169,110,0.2)',
                  }}
                >
                  {step.emoji}
                </div>

                {/* Text */}
                <h3
                  className="font-serif text-lg font-semibold mb-2"
                  style={{ color: '#3E2920' }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: '#7A5240' }}
                >
                  {step.description}
                </p>
              </div>

              {/* Arrow connector */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-6 z-10 items-center justify-center -translate-y-1/2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12H19M19 12L13 6M19 12L13 18"
                      stroke="#C9A96E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA repeat */}
        <div
          className={`mt-14 text-center transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '550ms' }}
        >
          <p
            className="text-sm mb-5 font-medium"
            style={{ color: '#7A5240' }}
          >
            Já seguiu e compartilhou? Agora é só preencher o formulário! 🐣
          </p>
          <button
            onClick={onOpenModal}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #4A6B8A 0%, #6B8FAD 100%)',
              boxShadow: '0 4px 16px rgba(74,107,138,0.3)',
            }}
          >
            <span>Preencher Formulário</span>
            <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
