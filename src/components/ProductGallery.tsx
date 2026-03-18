import { useEffect, useRef, useState } from 'react'

const photos = [
  { src: '/images/foto1.jpg', alt: 'Ovo de Páscoa Doka' },
  { src: '/images/foto2.jpg', alt: 'Ovo de Páscoa Doka' },
  { src: '/images/foto3.jpg', alt: 'Ovo de Páscoa Doka' },
  { src: '/images/foto4.jpg', alt: 'Ovo de Páscoa Doka' },
  { src: '/images/foto5.jpg', alt: 'Ovo de Páscoa Doka' },
]

export function ProductGallery() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 },
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="py-16 md:py-24 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F5F0E8 0%, #EDE5D5 100%)' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div
          className="text-center mb-12 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
          }}
        >
          <p className="text-sm font-medium tracking-widest uppercase mb-3" style={{ color: '#C9A96E' }}>
            Nossos produtos
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: '#334B61' }}>
            Feito com amor e ingredientes artesanais
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {photos.map((photo, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.95)',
                transitionDelay: `${i * 80}ms`,
                aspectRatio: i === 0 ? '1 / 1.2' : '1 / 1',
                gridColumn: i === 0 ? 'span 2 / span 2' : 'span 1 / span 1',
                ...(i === 0 && { gridRow: 'span 1' }),
              }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                style={{ display: 'block' }}
                onError={(e) => {
                  // Esconde se a foto não existir ainda
                  (e.currentTarget.parentElement as HTMLElement).style.display = 'none'
                }}
              />
              {/* Overlay sutil */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, rgba(62,41,32,0.25) 0%, transparent 50%)',
                }}
              />
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p
          className="text-center mt-10 text-sm transition-all duration-700 delay-500"
          style={{
            color: '#B08A50',
            opacity: visible ? 1 : 0,
          }}
        >
          🍫 Cada ovo é único, feito à mão com muito cuidado
        </p>
      </div>
    </section>
  )
}
